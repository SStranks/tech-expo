import { ENV } from './env';

export function globalErrorHandler() {
  if (ENV.mode === 'development') {
    globalThis.addEventListener('error', ({ colno, error, lineno, message }) => {
      console.error('GlobalErrorHandler:', { colno, error, lineno, message });
    });
    globalThis.addEventListener('unhandledrejection', ({ reason, target }) => {
      console.error('GlobalErrorHandler:', { reason, target });
    });
  }
}
