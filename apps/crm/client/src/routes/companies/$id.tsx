import { createFileRoute } from '@tanstack/react-router';

import CompaniesReadPage from '@Pages/companies/CompaniesReadPage';

export const Route = createFileRoute('/companies/$id')({
  component: CompaniesReadPage,
});
