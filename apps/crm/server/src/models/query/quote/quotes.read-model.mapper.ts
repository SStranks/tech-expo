import type { QuotesNotesTableSelect } from '#Config/schema/quotes/QuotesNotes.js';
import type { QuoteNoteDTO } from '#Models/domain/quote/note/note.dto.js';
import type { QuoteServiceDTO } from '#Models/domain/quote/service/service.dto.js';

import type { QuoteOverviewDTO } from './quotes.read-model.dto.js';
import type { QuoteNoteReadRow, QuoteOverviewReadRow, QuoteServiceReadRow } from './quotes.read-model.types.js';

import { asQuoteNoteId } from '#Models/domain/quote/note/note.mapper.js';
import { asQuoteId } from '#Models/domain/quote/quote.mapper.js';
import { asUserProfileId } from '#Models/domain/user/profile/profile.mapper.js';

export function quoteNoteRowToQuoteNoteReadRow(row: QuotesNotesTableSelect): QuoteNoteReadRow {
  return {
    id: asQuoteNoteId(row.id),
    clientGeneratedId: row.clientGeneratedId,
    createdAt: row.createdAt,
    createdByUserProfileId: asUserProfileId(row.createdByUserProfileId),
    note: row.note,
    quoteId: asQuoteId(row.quoteId),
  };
}

export function quoteNoteReadRowToQuoteNoteDTO(row: QuoteNoteReadRow): QuoteNoteDTO {
  return {
    id: row.id,
    clientGeneratedId: row.clientGeneratedId,
    createdAt: row.createdAt,
    createdByUserProfileId: row.createdByUserProfileId,
    note: row.note,
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
    createdAt: row.createdAt,
    stage: row.stage,
    title: row.title,
    company: {
      id: row.company.id,
      name: row.company.name,
      logo: row.company.logo ?? '',
    },
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
    totalAmount: {
      id: '',
      amount: row.total,
      currency: '',
    },
  };
}
