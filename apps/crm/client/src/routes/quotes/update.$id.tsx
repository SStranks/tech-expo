import { createFileRoute, redirect } from '@tanstack/react-router';

import QuoteUpdatePage from '@Pages/quotes/QuoteUpdatePage';

export const Route = createFileRoute('/quotes/update/$id')({
  component: QuoteUpdatePage,
  beforeLoad: ({ params }) => {
    if (!params.id) {
      throw redirect({
        replace: true,
        to: '/quotes',
      });
    }
  },
});
