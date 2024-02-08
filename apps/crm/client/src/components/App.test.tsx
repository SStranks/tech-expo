import App from './App';
import { render } from '@testing-library/react';

console.error = jest.fn();
console.warn = jest.fn();

describe('Initialization', () => {
  afterEach(() => {
    jest.resetAllMocks;
  });

  test('App initializes without error or warnings', () => {
    render(<App />);

    expect(console.error).toHaveBeenCalledTimes(0);
    expect(console.warn).toHaveBeenCalledTimes(0);
  });
});
