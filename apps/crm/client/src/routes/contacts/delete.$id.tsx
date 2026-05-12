import { createFileRoute } from '@tanstack/react-router';

import ContactsDeletePage from '@Pages/contacts/ContactsDeletePage';

export const Route = createFileRoute('/contacts/delete/$id')({
  component: ContactsDeletePage,
});
