import type { QuoteId } from '../quote.types.js';
import type { QuoteServiceClientGeneratedId, QuoteServiceId } from './service.types.js';

export type QuoteServiceDTO = {
  id: QuoteServiceId;
  clientGeneratedId: QuoteServiceClientGeneratedId;
  title: string;
  price: {
    id: string;
    amount: string;
    currency: string;
  };
  quantity: number;
  discount: number;
  totalAmount: {
    id: string;
    amount: string;
    currency: string;
  };
  quoteId: QuoteId;
  createdAt: Date;
};
