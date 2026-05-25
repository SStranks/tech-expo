import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import type { QuoteId } from '../quote.types.js';
import type { QuoteNoteClientGeneratedId, QuoteNoteId } from './note.types.js';

export type QuoteNoteDTO = {
  id: QuoteNoteId;
  clientGeneratedId: QuoteNoteClientGeneratedId;
  note: string;
  quoteId: QuoteId;
  createdAt: Date;
  createdByUserProfileId: UserProfileId;
};
