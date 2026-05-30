import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import type { ContactNoteClientGeneratedId, ContactNoteId } from './note.types.js';

export type ContactNoteDTO = {
  id: ContactNoteId;
  clientGeneratedId: ContactNoteClientGeneratedId;
  createdAt: Date;
  createdByUserProfileId: UserProfileId;
  note: string;
};
