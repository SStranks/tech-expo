import type { QuoteId } from '../quote.types.js';
import type { QuoteServiceClientGeneratedId, QuoteServiceId } from './service.types.js';

export type QuoteServiceDTO = {
  id: QuoteServiceId;
  clientGeneratedId: QuoteServiceClientGeneratedId;
  createdAt: Date;
  discount: number;
  price: {
    id: string;
    amount: string;
    currency: string;
  };
  quantity: number;
  quoteId: QuoteId;
  title: string;
  totalAmount: {
    id: string;
    amount: string;
    currency: string;
  };
};
