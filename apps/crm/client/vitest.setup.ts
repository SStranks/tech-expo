import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(), // Deprecated
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(), // Deprecated
  })),
});

const localStorageMock = (function () {
  let store = {};

  return {
    clear: function () {
      store = {};
    },
    getItem: function (key) {
      return store[key] || null;
    },
    removeItem: function (key) {
      delete store[key];
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
});
