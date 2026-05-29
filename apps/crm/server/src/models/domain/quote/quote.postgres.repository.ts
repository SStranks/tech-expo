import type { PostgresTransaction } from '#Config/dbPostgres.js';
import type { QuotesNotesTableInsert } from '#Config/schema/quotes/QuotesNotes.js';

import type { PersistedQuoteNote } from './note/note.js';
import type { NewQuote, PersistedQuote } from './quote.js';
import type { QuoteRepository } from './quote.repository.js';
import type { QuoteId } from './quote.types.js';

import { eq, inArray } from 'drizzle-orm';

import { postgresDB, postgresDBCall } from '#Config/dbPostgres.js';
import QuotesTable from '#Config/schema/quotes/Quotes.js';
import QuotesNotesTable from '#Config/schema/quotes/QuotesNotes.js';
import PostgresError from '#Utils/errors/PostgresError.js';

import { QuoteNote } from './note/note.js';
import { Quote } from './quote.js';
import { quoteRowToDomain } from './quote.mapper.js';

export class PostgresQuoteRepository implements QuoteRepository {
  constructor() {}

  async findQuoteById(id: QuoteId): Promise<PersistedQuote | null> {
    return postgresDBCall(async () => {
      const row = await postgresDB.query.QuotesTable.findFirst({
        where: (quote, { eq }) => eq(quote.id, id),
      });
      return row ? quoteRowToDomain(row) : null;
    });
  }

  async save(quote: NewQuote | PersistedQuote): Promise<PersistedQuote> {
    return postgresDBCall(async () => {
      const persistedQuote = await postgresDB.transaction(async (tx) => {
        const persistedQuote = quote.isPersisted() ? quote : await this.insert(tx, quote);

        if (persistedQuote.hasDirtyFields()) await this.update(tx, persistedQuote);

        await this.syncNotes(tx, persistedQuote);

        persistedQuote.commit();
        return persistedQuote;
      });

      return persistedQuote;
    });
  }

  async remove(id: QuoteId): Promise<QuoteId> {
    return postgresDBCall(async () => {
      const row = await postgresDB.delete(QuotesTable).where(eq(QuotesTable.id, id)).returning({ id: QuotesTable.id });

      if (row.length === 0 || row[0] === undefined)
        throw new PostgresError({ kind: 'NOT_FOUND', message: `Quote ${id} not found` });
      if (row.length > 1)
        throw new PostgresError({ kind: 'INTERNAL_ERROR', message: 'Invariant violation: multiple companies deleted' });

      return row[0].id;
    });
  }

  async findQuotesByIds(ids: QuoteId[]): Promise<PersistedQuote[]> {
    return postgresDBCall(async () => {
      const rows = await postgresDB.query.QuotesTable.findMany({
        where: (quote, { inArray }) => inArray(quote.id, ids),
      });
      return rows.map((row) => quoteRowToDomain(row));
    });
  }

  private async insert(tx: PostgresTransaction, quote: NewQuote): Promise<PersistedQuote> {
    return postgresDBCall(async () => {
      const rows = await tx
        .insert(QuotesTable)
        .values({
          clientGeneratedId: quote.clientGeneratedId,
          companyId: quote.companyId,
          dueAt: quote.dueAt,
          issuedAt: quote.issuedAt,
          preparedByUserProfileId: quote.preparedByUserProfileId,
          preparedForContactId: quote.preparedForContactId,
          salesTax: quote.salesTax,
          stage: quote.stage,
          title: quote.title,
          totalAmount: quote.totalAmount,
        })
        .returning();

      if (rows.length === 0 || rows[0] === undefined)
        throw new PostgresError({ kind: 'INTERNAL_ERROR', message: 'Failed to create Quote' });

      return Quote.promote(quote, {
        id: rows[0].id,
        clientGeneratedId: rows[0].clientGeneratedId,
        createdAt: rows[0].createdAt,
      });
    });
  }

  private async update(tx: PostgresTransaction, quote: PersistedQuote): Promise<PersistedQuote> {
    await tx.update(QuotesTable).set(quote.pullDirtyFields()).where(eq(QuotesTable.id, quote.id));
    return quote;
  }

  private async syncNotes(tx: PostgresTransaction, quote: PersistedQuote) {
    const { addedNotes, removedNoteIds, updatedNotes } = quote.pullNoteChanges();
    let persistedNotes: PersistedQuoteNote[] = [];

    if (addedNotes.size > 0) {
      const rows = await tx
        .insert(QuotesNotesTable)
        .values(
          [...addedNotes.values()].map(
            (n): QuotesNotesTableInsert => ({
              clientGeneratedId: n.clientGeneratedId,
              content: n.content,
              quoteId: n.quoteId,
            })
          )
        )
        .returning();

      persistedNotes = rows.map((row) => {
        const tempId = row.clientGeneratedId;
        if (!tempId) {
          throw new PostgresError({
            kind: 'INTERNAL_ERROR',
            message: 'Inserted quote-note missing clientGeneratedId',
          });
        }

        const note = addedNotes.get(tempId);
        if (!note) {
          throw new PostgresError({
            kind: 'INTERNAL_ERROR',
            message: `No quote-note found for clientGeneratedId ${tempId}`,
          });
        }

        return QuoteNote.promote(note, {
          id: row.id,
          createdAt: row.createdAt,
        });
      });
    }

    if (removedNoteIds.size > 0) {
      await tx.delete(QuotesNotesTable).where(inArray(QuotesNotesTable.id, [...removedNoteIds]));
    }

    if (updatedNotes.size > 0) {
      for (const [UUID, note] of updatedNotes) {
        await tx.update(QuotesNotesTable).set(note.pullDirtyFields()).where(eq(QuotesNotesTable.id, UUID));
      }
    }

    quote.commitNotes(persistedNotes);
  }
}
