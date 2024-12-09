import { render } from '@testing-library/react';
import { config } from 'react-transition-group';
import { vi } from 'vitest';

import UserSettingsModal from './UserSettingsModal';

describe('Initialization', () => {
  const setStateMockFn = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Component should render correctly', () => {
    render(
      <UserSettingsModal userName="Agent Smith" settingsPortalActive={false} setSettingsPortalActive={setStateMockFn} />
    );
    // NOTE:  To disable react-transition-group; sets enter state immediately
    config.disabled = true;

    expect(true).toBeTruthy();
  });
});
