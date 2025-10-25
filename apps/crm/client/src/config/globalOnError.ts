export function globalErrorHandler() {
  if (process.env.NODE_ENV === 'development') {
    globalThis.addEventListener('error', ({ colno, error, lineno, message }) => {
      console.error('GlobalErrorHandler:', { colno, error, lineno, message });
    });
    globalThis.addEventListener('unhandledrejection', ({ reason, target }) => {
      console.error('GlobalErrorHandler:', { reason, target });
    });
  }
}
