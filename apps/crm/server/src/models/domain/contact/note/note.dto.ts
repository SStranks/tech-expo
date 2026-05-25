import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import type { ContactNoteId } from './note.types.js';

export type ContactNoteDTO = {
  id: ContactNoteId;
  note: string;
  createdByUserProfileId: UserProfileId;
  createdAt: Date;
};
