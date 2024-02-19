import { render, screen } from '@testing-library/react';
import SettingsItem from './SettingsItem';

describe('Initialization', () => {
  test('Component should render correctly', () => {
    render(<SettingsItem icon={'url'} title={'title'} description={'description'} />);

    const displayIcon = screen.getByAltText(/icon/i);
    const settingTitle = screen.getByText('title');
    const settingDescription = screen.getByText('description');
    const editButton = screen.getByRole('button', { name: 'edit title' });

    expect(displayIcon).toBeInTheDocument();
    expect(settingTitle).toBeInTheDocument();
    expect(settingDescription).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
  });
});
