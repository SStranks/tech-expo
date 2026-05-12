import { createFileRoute } from '@tanstack/react-router';

import UpdatePasswordPage from '@Pages/update-password/UpdatePasswordPage';

export const Route = createFileRoute('/update-password')({
  component: UpdatePasswordPage,
});
