import { createFileRoute } from '@tanstack/react-router';

import ContactsPage from '@Pages/contacts/ContactsPage';

export const Route = createFileRoute('/contacts/')({
  component: ContactsPage,
});
