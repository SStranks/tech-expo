import { render } from '@testing-library/react';
import UserSettingsModal from './UserSettingsModal';
import { config } from 'react-transition-group';

describe('Initialization', () => {
  const setStateMockFn = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
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
