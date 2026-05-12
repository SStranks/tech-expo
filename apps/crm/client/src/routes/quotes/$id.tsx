import { createFileRoute } from '@tanstack/react-router';

import QuoteReadPage from '@Pages/quotes/QuoteReadPage';

export const Route = createFileRoute('/quotes/$id')({
  component: QuoteReadPage,
});
