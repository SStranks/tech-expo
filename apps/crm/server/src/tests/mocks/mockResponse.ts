import type { AuthenticatedLocals } from '#Types/express.js';
import type { Response } from 'express';

import httpMocks from 'node-mocks-http';

export function createMockResponse(): Response<{}, AuthenticatedLocals> {
  return httpMocks.createResponse() as unknown as Response<
    {},
    AuthenticatedLocals
  >;
}
