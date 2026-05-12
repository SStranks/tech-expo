import { createFileRoute } from '@tanstack/react-router';

import CompaniesPage from '@Pages/companies/CompaniesPage';

export const Route = createFileRoute('/companies/')({
  component: CompaniesPage,
});
