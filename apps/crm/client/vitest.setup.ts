import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
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
