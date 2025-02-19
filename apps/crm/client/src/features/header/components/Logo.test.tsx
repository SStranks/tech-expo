import { render, screen } from '@testing-library/react';

import CompanyLogo from '@Img/CompanyLogo.png';

import Logo from './Logo';

describe('Initialization', () => {
  test('Component renders correctly; contains logo image and company title', () => {
    render(<Logo title="Company Title" logoUrl={CompanyLogo} />);

    const companyLogoImg = screen.getByRole('img');
    const companyNameH1 = screen.getByRole('heading', { level: 1 });

    expect(companyLogoImg).toBeInTheDocument();
    expect(companyLogoImg).toBeVisible();
    expect(companyLogoImg).toHaveAccessibleName('company logo');
    expect(companyNameH1).toBeInTheDocument();
    expect(companyNameH1).toBeVisible();
    expect(companyNameH1).toHaveTextContent(/Company Title/);
  });
});

// TODO: .
// If 'user is admin; clicking logo or title navigates to settings page'
// If 'Loading state; If app data pending, loading animation class is present'
// If 'Success state; If app data success, success animation class is present'
// If 'Failure state; If app data failure, failure animation class is present'
