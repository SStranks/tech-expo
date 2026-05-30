import type { UserProfileId } from '#Models/domain/user/profile/profile.types.js';

import type { CompanyNoteClientGeneratedId, CompanyNoteId } from './note.types.js';

export type CompanyNoteDTO = {
  id: CompanyNoteId;
  clientGeneratedId: CompanyNoteClientGeneratedId;
  createdAt: Date;
  createdByUserProfileId: UserProfileId;
  note: string;
};
