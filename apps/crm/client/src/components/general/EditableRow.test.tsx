import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import IconAdministration from '@Components/svg/IconAdministration';

import EditableRow from './EditableRow';

describe('Initialization', () => {
  test('Component should render correctly', () => {
    render(<EditableRow IconSvg={IconAdministration} title="title" description="description" />);

    const displayIcon = screen.getByTitle(/icon administration/i);
    const settingTitle = screen.getByText('title');
    const settingDescription = screen.getByText('description');
    const editButton = screen.getByRole('button', { name: /^show edit title input$/i });
    const cancelButton = screen.queryByRole('button', { name: /cancel/i });
    const saveButton = screen.queryByRole('button', { name: /save/i });
    const textInput = screen.queryByRole('textbox', { name: /^edit input$/i });

    expect(displayIcon).toBeInTheDocument();
    expect(settingTitle).toBeInTheDocument();
    expect(settingDescription).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
    // Conditionally revealed elements
    expect(cancelButton).not.toBeInTheDocument();
    expect(saveButton).not.toBeInTheDocument();
    expect(textInput).not.toBeInTheDocument();
  });

  test('Component should render correctly; edit button click reveals conditional components', async () => {
    render(<EditableRow IconSvg={IconAdministration} title="title" description="description" />);
    const user = userEvent.setup();

    const editButton = screen.getByRole('button', { name: /^show edit title input$/i });
    await user.click(editButton);
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    const saveButton = screen.getByRole('button', { name: /save/i });
    const textInput = screen.getByRole('textbox', { name: /^edit title$/i });

    expect(cancelButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
    expect(textInput).toBeInTheDocument();
  });
});

describe('Functionality', () => {
  test('Revealed cancel button; should revert component to original state', async () => {
    render(<EditableRow IconSvg={IconAdministration} title="title" description="description" />);
    const user = userEvent.setup();

    let editButton = screen.getByRole('button', { name: /^show edit title input$/i });
    await user.click(editButton);
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    expect(editButton).not.toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();

    await user.click(cancelButton);
    editButton = screen.getByRole('button', { name: /^show edit title input$/i });
    expect(editButton).toBeInTheDocument();
    expect(cancelButton).not.toBeInTheDocument();
  });

  test('Revealed save button; should submit input value and revert component to original state', async () => {
    render(<EditableRow IconSvg={IconAdministration} title="title" description="description" />);
    const user = userEvent.setup();
    const submitSpy = vi.spyOn(console, 'log');

    let editButton = screen.getByRole('button', { name: /^show edit title input$/i });
    await user.click(editButton);
    const textInput = screen.getByRole('textbox', { name: /^edit title$/i });
    await user.click(textInput);
    await user.keyboard('User Inputted Text');
    const saveButton = screen.getByRole('button', { name: /save/i });
    expect(editButton).not.toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();

    await user.click(saveButton);
    expect(submitSpy).toHaveBeenCalledWith(expect.stringMatching('User Inputted Text'));
    editButton = screen.getByRole('button', { name: /^show edit title input$/i });
    expect(editButton).toBeInTheDocument();
    expect(saveButton).not.toBeInTheDocument();
  });
});
