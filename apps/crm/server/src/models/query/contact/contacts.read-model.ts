import type { UUID } from '@apps/crm-shared';

import type { ContactQuery, ContactReadRow } from './contacts.read-model.types.js';

export interface ContactReadModel {
  count(query?: ContactQuery): Promise<number>;
  findContactsByIds(ids: UUID[]): Promise<ContactReadRow[]>;
}
