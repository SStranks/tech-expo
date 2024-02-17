import { render, screen } from '@testing-library/react';
import DefaultLayout from './DefaultLayout';

describe('Initialization', () => {
  test('Component should render correctly', () => {
    render(<DefaultLayout aside={<aside />} main={<main />} header={<header />} />);

    const mainElement = screen.getByRole('main');
    const asideElement = screen.getByRole('complementary');
    const headerElement = screen.getByRole('banner');

    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toBeVisible();
    expect(asideElement).toBeInTheDocument();
    expect(asideElement).toBeVisible();
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toBeVisible();
  });
});
