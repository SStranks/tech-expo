import { createFileRoute } from '@tanstack/react-router';

import CompaniesDeletePage from '@Pages/companies/CompaniesDeletePage';

export const Route = createFileRoute('/companies/delete/$id')({
  component: CompaniesDeletePage,
});
