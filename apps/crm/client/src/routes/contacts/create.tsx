import { createFileRoute } from '@tanstack/react-router';

import ContactsCreatePage from '@Pages/contacts/ContactsCreatePage';

export const Route = createFileRoute('/contacts/create')({
  component: ContactsCreatePage,
});
