import { createFileRoute } from '@tanstack/react-router';

import ContactsReadPage from '@Pages/contacts/ContactsReadPage';

export const Route = createFileRoute('/contacts/$id')({
  component: ContactsReadPage,
});
