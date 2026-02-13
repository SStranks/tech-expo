import '@testing-library/jest-dom';
import { fn } from 'jest-mock';

import { TextDecoder, TextEncoder } from 'node:util';

globalThis.TextDecoder = TextDecoder;
globalThis.TextEncoder = TextEncoder;

Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: fn().mockImplementation((query) => ({
    addEventListener: fn(),
    addListener: fn(), // Deprecated
    dispatchEvent: fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: fn(),
    removeListener: fn(), // Deprecated
  })),
});

const localStorageMock = (function () {
  let store: Record<string, string> = {};

  return {
    clear: function () {
      store = {};
    },
    getItem: function (key: string) {
      return store[key] || null;
    },
    removeItem: function (key: string) {
      delete store[key];
    },
    setItem: function (key: string, value: string) {
      store[key] = value.toString();
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
});

// https://stackoverflow.com/questions/44249985/testing-code-that-uses-an-intersectionobserver
// function setupIntersectionObserverMock({
//   root = null,
//   rootMargin = '',
//   thresholds = [],
//   disconnect = () => null,
//   observe = () => null,
//   takeRecords = () => [],
//   unobserve = () => null,
// } = {}): void {
//   class MockIntersectionObserver implements IntersectionObserver {
//     readonly root: Element | null = root;

//     readonly rootMargin: string = rootMargin;

//     readonly thresholds: ReadonlyArray<number> = thresholds;

//     disconnect: () => void = disconnect;

//     observe: (target: Element) => void = observe;

//     takeRecords: () => IntersectionObserverEntry[] = takeRecords;

//     unobserve: (target: Element) => void = unobserve;
//   }

//   Object.defineProperty(window, 'IntersectionObserver', {
//     writable: true,
//     configurable: true,
//     value: MockIntersectionObserver,
//   });

//   Object.defineProperty(global, 'IntersectionObserver', {
//     writable: true,
//     configurable: true,
//     value: MockIntersectionObserver,
//   });
// }

// setupIntersectionObserverMock();

// Object.defineProperty(window, 'matchMedia', {
//   writable: true,
//   value: jest.fn().mockImplementation((query) => ({
//     matches: false,
//     media: query,
//     // eslint-disable-next-line unicorn/no-null
//     onchange: null,
//     addEventListener: jest.fn(),
//     removeEventListener: jest.fn(),
//     dispatchEvent: jest.fn(),
//   })),
// });

// const mockIntersectionObserver = jest.fn();
// mockIntersectionObserver.mockReturnValue({
//   observe: () => null,
//   unobserve: () => null,
//   disconnect: () => null,
// });
// window.IntersectionObserver = mockIntersectionObserver;

// Implicit ARIA Roles for getByRole:
// https://www.w3.org/TR/html-aria/#docconformance

// https://github.com/testing-library/jest-dom
// --- Custom matchers ---
// toBeDisabled
// toBeEnabled
// toBeEmptyDOMElement
// toBeInTheDocument
// toBeInvalid
// toBeRequired
// toBeValid
// toBeVisible
// toContainElement
// toContainHTML
// toHaveAccessibleDescription
// toHaveAccessibleName
// toHaveAttribute
// toHaveClass
// toHaveFocus
// toHaveFormValues
// toHaveStyle
// toHaveTextContent
// toHaveValue
// toHaveDisplayValue
// toBeChecked
// toBePartiallyChecked
// toHaveErrorMessage
