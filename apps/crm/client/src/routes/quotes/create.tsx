import { createFileRoute } from '@tanstack/react-router';

import QuoteCreatePage from '@Pages/quotes/QuoteCreatePage';

export const Route = createFileRoute('/quotes/create')({
  component: QuoteCreatePage,
});
