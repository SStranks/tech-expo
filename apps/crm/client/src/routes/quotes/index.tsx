import { createFileRoute } from '@tanstack/react-router';

import QuotesPage from '@Pages/quotes/QuotesPage';

export const Route = createFileRoute('/quotes/')({
  component: QuotesPage,
});
