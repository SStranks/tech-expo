import { createFileRoute, redirect } from '@tanstack/react-router';

import QuoteDeletePage from '@Pages/quotes/QuoteDeletePage';

export const Route = createFileRoute('/quotes/delete/$id')({
  component: QuoteDeletePage,
  beforeLoad: ({ params }) => {
    if (!params.id) {
      throw redirect({
        replace: true,
        to: '/quotes',
      });
    }
  },
});
