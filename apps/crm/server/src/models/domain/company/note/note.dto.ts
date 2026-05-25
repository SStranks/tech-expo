import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import type { CompanyNoteId } from './note.types.js';

export type CompanyNoteDTO = {
  id: CompanyNoteId;
  note: string;
  createdByUserProfileId: UserProfileId;
  createdAt: Date;
};
