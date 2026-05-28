import type { UUID } from '@apps/crm-shared';

import type { QuoteServiceDTO } from './service.dto.js';
import type { PersistedQuoteService } from './service.js';
import type { QuoteServiceId } from './service.types.js';

export function asQuoteServiceId(id: UUID): QuoteServiceId {
  return id as QuoteServiceId;
}

export function quoteServiceDomainToQuoteServiceDTO(quoteService: PersistedQuoteService): QuoteServiceDTO {
  return {
    id: quoteService.id,
    clientGeneratedId: quoteService.clientGeneratedId,
    createdAt: quoteService.createdAt,
    discount: quoteService.discount,
    price: {
      id: '',
      amount: quoteService.price,
      currency: '',
    },
    quantity: quoteService.quantity,
    quoteId: quoteService.quoteId,
    title: quoteService.title,
    totalAmount: {
      id: '',
      amount: quoteService.total,
      currency: '',
    },
  };
}
