import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import App from './App';

console.error = jest.fn();
console.warn = jest.fn();

describe('Initialization', () => {
  afterEach(() => {
    jest.resetAllMocks;
  });

  test('App initializes without error or warnings', () => {
    render(<App />, { wrapper: BrowserRouter });

    expect(console.error).toHaveBeenCalledTimes(0);
    expect(console.warn).toHaveBeenCalledTimes(0);
  });
});

// TODO:  Routes.
