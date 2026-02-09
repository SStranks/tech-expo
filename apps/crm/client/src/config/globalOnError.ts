import { ENV } from './env';

export function globalErrorHandler() {
  if (ENV.mode === 'development') {
    globalThis.addEventListener(
      'error',
      ({ colno, error, lineno, message }: { colno: number; error: unknown; lineno: number; message: string }) => {
        console.error('GlobalErrorHandler:', { colno, error, lineno, message });
      }
    );
    globalThis.addEventListener('unhandledrejection', ({ reason, target }: { reason: unknown; target: unknown }) => {
      console.error('GlobalErrorHandler:', { reason, target });
    });
  }
}
