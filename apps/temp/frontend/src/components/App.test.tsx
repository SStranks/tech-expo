import App from './App';
import { render, screen } from '@testing-library/react';

describe('Test Jest', () => {
  test('App loads', () => {
    render(<App />);

    const title = screen.getByText('This is a test app');
    expect(title).toBeInTheDocument;
  });
});
