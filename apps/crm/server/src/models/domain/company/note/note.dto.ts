import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import type { CompanyNoteId } from './note.types.js';

export type CompanyNoteDTO = {
  id: CompanyNoteId;
  createdAt: Date;
  createdByUserProfileId: UserProfileId;
  note: string;
};
