import { createFileRoute } from '@tanstack/react-router';

import CompaniesCreatePage from '@Pages/companies/CompaniesCreatePage';

export const Route = createFileRoute('/companies/create')({
  component: CompaniesCreatePage,
});
