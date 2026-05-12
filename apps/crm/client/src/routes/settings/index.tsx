import { createFileRoute } from '@tanstack/react-router';

import SettingsPage from '@Pages/settings/SettingsPage';

export const Route = createFileRoute('/settings/')({
  component: SettingsPage,
});
