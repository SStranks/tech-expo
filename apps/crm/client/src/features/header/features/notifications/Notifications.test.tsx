import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { config } from 'react-transition-group';
import { notificationsArr } from '#Data/MockData';
import Notifications from './Notifications';

describe('Initialization', () => {
  test('Component should render correctly; notifications window should not be present before click event', () => {
    render(<Notifications notifications={[]} />);

    const notificationsButton = screen.getByRole('button', { name: 'notifications' });
    const notificationSvg = screen.getByRole('img');
    const notificationsContent = screen.queryByTestId('notifications');
    const notificationsIndicator = screen.getByTestId('notifications-indicator');

    expect(notificationsButton).toBeInTheDocument();
    expect(notificationsButton).toBeVisible();
    expect(notificationsButton).toContainElement(notificationSvg);
    expect(notificationsButton).toContainElement(notificationsIndicator);
    expect(notificationsContent).not.toBeInTheDocument();
  });

  test('Component should render notifications list-items; data passed as prop', async () => {
    render(<Notifications notifications={notificationsArr} />);
    const user = userEvent.setup();

    const notificationsButton = screen.getByRole('button', { name: 'notifications' });
    await user.click(notificationsButton);
    const notificationsListItems = screen.getAllByRole('listitem');

    expect(notificationsListItems).toHaveLength(notificationsArr.length);
  });

  test('Component should render "no notifications" if notifications prop is empty array', async () => {
    render(<Notifications notifications={[]} />);
    const user = userEvent.setup();

    const notificationsListItems = screen.queryAllByRole('listitem');
    const notificationsButton = screen.getByRole('button', { name: 'notifications' });
    await user.click(notificationsButton);

    expect(notificationsListItems).toHaveLength(0);
  });
});

describe('Functionality', () => {
  test('Notifications content should insert into portal "portal-notifications" upon clicking icon', async () => {
    render(<Notifications notifications={[]} />);
    const user = userEvent.setup();
    // NOTE:  To disable react-transition-group; sets enter state immediately
    config.disabled = true;

    const notificationsButton = screen.getByRole('button', { name: 'notifications' });

    await user.click(notificationsButton);
    // Portal content now rendered
    const notificationsContent = screen.getByTestId('notifications');

    expect(notificationsContent).toBeInTheDocument();
  });

  test('Notifications modal should close upon "Escape" keydown', async () => {
    render(<Notifications notifications={[]} />);
    const user = userEvent.setup();
    // NOTE:  To disable react-transition-group; sets enter state immediately
    config.disabled = true;

    const notificationsButton = screen.getByRole('button', { name: 'notifications' });

    await user.click(notificationsButton);
    // Portal content now rendered
    const notificationsContent = screen.getByTestId('notifications');
    expect(notificationsContent).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(notificationsContent).not.toBeInTheDocument();
  });

  test('Notifications modal should close upon clicking outside content area (including initial button)', async () => {
    const { container } = render(<Notifications notifications={[]} />);
    const user = userEvent.setup();
    // NOTE:  To disable react-transition-group; sets enter state immediately
    config.disabled = true;

    const notificationsButton = screen.getByRole('button', { name: 'notifications' });

    await user.click(notificationsButton);
    // Portal content now rendered
    const notificationsContent = screen.getByTestId('notifications');
    expect(notificationsContent).toBeInTheDocument();

    await user.click(container);
    expect(notificationsContent).not.toBeInTheDocument();
  });

  test('If there are no notifications to be displayed; show no dot indicator', () => {
    render(<Notifications notifications={[]} />);

    const notificationsIndicator = screen.getByTestId('notifications-indicator');

    expect(notificationsIndicator).toHaveClass(/indicator--noMessages/);
  });

  test('If there are notifications; but one or more are unread; show red dot indicator', () => {
    render(<Notifications notifications={notificationsArr} />);

    const notificationsIndicator = screen.getByTestId('notifications-indicator');

    expect(notificationsIndicator).toHaveClass(/indicator--unreadMessages/);
  });

  // eslint-disable-next-line jest/no-commented-out-tests
  // test('If there are notifications; all have been read; show green dot indicator', () => {})
});
