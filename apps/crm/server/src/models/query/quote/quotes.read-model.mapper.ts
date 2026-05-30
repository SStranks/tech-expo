import type { QuotesNotesTableSelect } from '#Config/schema/quotes/QuotesNotes.js';
import type { QuoteNoteDTO } from '#Models/domain/quote/note/note.dto.js';
import type { QuoteServiceDTO } from '#Models/domain/quote/service/service.dto.js';

import type { QuoteOverviewDTO } from './quotes.read-model.dto.js';
import type { QuoteNoteReadRow, QuoteOverviewReadRow, QuoteServiceReadRow } from './quotes.read-model.types.js';

export function quoteNoteRowToQuoteNoteReadRow(row: QuotesNotesTableSelect): QuoteNoteReadRow {
  return {
    id: row.id,
    clientGeneratedId: row.clientGeneratedId,
    content: row.content,
    createdAt: row.createdAt,
    quoteId: row.quoteId,
  };
}

export function quoteNoteReadRowToQuoteNoteDTO(row: QuoteNoteReadRow): QuoteNoteDTO {
  return {
    id: row.id,
    clientGeneratedId: row.clientGeneratedId,
    content: row.content,
    createdAt: row.createdAt,
    quoteId: row.quoteId,
  };
}

export function quoteServiceReadRowToQuoteServiceDTO(row: QuoteServiceReadRow): QuoteServiceDTO {
  return {
    id: row.id,
    clientGeneratedId: row.clientGeneratedId,
    createdAt: row.createdAt,
    discount: Number.parseFloat(row.discount),
    price: { id: '', amount: row.price, currency: '' },
    quantity: row.quantity,
    quoteId: row.quoteId,
    title: row.title,
    totalAmount: { id: '', amount: row.totalAmount, currency: '' },
  };
}

export function quoteOverviewRowToQuoteOverviewDTO(row: QuoteOverviewReadRow): QuoteOverviewDTO {
  return {
    id: row.id,
    company: {
      id: row.company.id,
      logo: row.company.logo ?? '',
      name: row.company.name,
    },
    createdAt: row.createdAt,
    preparedBy: {
      id: row.preparedBy.id,
      firstName: row.preparedBy.firstName,
      image: row.preparedBy.image ?? '',
      lastName: row.preparedBy.lastName,
    },
    preparedFor: {
      id: row.preparedFor.id,
      firstName: row.preparedFor.firstName,
      image: row.preparedFor.image ?? '',
      lastName: row.preparedFor.lastName,
    },
    stage: row.stage,
    title: row.title,
    totalAmount: {
      id: '',
      amount: row.total,
      currency: '',
    },
  };
}
