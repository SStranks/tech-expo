import type { ApiResponseError, ApiResponseSuccess } from '@apps/crm-shared';
import type { Response } from 'supertest';

import request from 'supertest';
import { describe, test, vi } from 'vitest';

import mockUser from '#Tests/mocks/mockUser.js';

const MOCK_QUERYREFRESHTOKEN = vi.fn(() => ({}));
const MOCK_QUERYUSERBYID = vi.fn(() => mockUser());
const MOCK_VERIFYAUTHTOKEN = vi.fn(() => ({}));
const MOCK_VERIFYREFRESHTOKEN = vi.fn(() => ({}));

vi.mock('@as-integrations/express5', () => ({
  expressMiddleware: (a: unknown) => {
    return a;
  },
}));

vi.mock('#Graphql/apolloServer.ts', () => ({
  apolloServer: vi.fn(),
}));

vi.mock('#Lib/nodemailer/NodeMailer.ts', () => ({
  default: {
    sendAccountVerificationEmail: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
  },
}));

vi.mock('#Services/user.service.ts', () => {
  class MockUserService {
    constructor() {}

    activateRefreshToken = vi.fn();
    advanceRefreshToken = vi.fn();
    blacklistAllRefreshTokens = vi.fn();
    blacklistToken = vi.fn();
    clearCookies = vi.fn();
    createAuthCookie = vi.fn();
    createRefreshCookie = vi.fn();
    decodeAuthToken = vi.fn().mockReturnValue({});
    deleteAccount = vi.fn();
    deleteAllRefreshTokens = vi.fn().mockReturnValue({});
    forgotPassword = vi.fn().mockReturnValue('');
    freezeAccount = vi.fn();
    generateClientTokens = vi.fn().mockReturnValue({});
    insertRefreshToken = vi.fn();
    insertUser = vi.fn();
    isExistingAccount = vi.fn();
    isPasswordValid = vi.fn();
    isResetTokenValid = vi.fn().mockReturnValue({});
    isTokenBlacklisted = vi.fn();
    loginAccount = vi.fn().mockReturnValue({});
    logoutAccount = vi.fn().mockReturnValue(Promise.resolve());
    queryRefreshToken = MOCK_QUERYREFRESHTOKEN;
    queryUserByEmail = vi.fn().mockReturnValue({});
    queryUserById = MOCK_QUERYUSERBYID;
    resetPassword = vi.fn();
    signAuthToken = vi.fn();
    updatePassword = vi.fn();
    updateRefreshToken = vi.fn();
    verifyAccount = vi.fn();
    verifyAuthToken = MOCK_VERIFYAUTHTOKEN;
    verifyRefreshToken = MOCK_VERIFYREFRESHTOKEN;
  }

  return {
    UserService: MockUserService,
  };
});

const { default: app } = await import('#App/app.js');

const VALID_EMAIL = 'valid@email.com';
const INVALID_EMAIL = 'invalid@email';
const VALID_PASSWORD = 'password';
const VALID_CONFIRM_PASSWORD = 'password';
const INVALID_CONFIRM_PASSWORD = 'pass';
const VERIFICATION_CODE = '123456';

describe('PUBLIC Routes', () => {
  describe(`'POST /api/users/signup'`, () => {
    test('No email provided; should return 400', async () => {
      await request(app)
        .post('/api/users/signup')
        .set('Content-Type', 'application/json')
        .send({})
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Provide all required fields');
    });

    test('Invalid email provided; should return 401', async () => {
      await request(app)
        .post('/api/users/signup')
        .set('Content-Type', 'application/json')
        .send({ email: INVALID_EMAIL })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Invalid email address');
    });

    test('Valid email provided; should return 200', async () => {
      await request(app)
        .post('/api/users/signup')
        .set('Content-Type', 'application/json')
        .send({ email: VALID_EMAIL })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(
          (res: Response) => (res.body as ApiResponseSuccess).message === 'Signup email with verification code sent'
        );
    });
  });

  describe('POST /api/users/confirmSignup', () => {
    test('No email provided; should return 400', async () => {
      await request(app)
        .post('/api/users/confirmSignup')
        .set('Content-Type', 'application/json')
        .send({
          password: VALID_PASSWORD,
          passwordConfirm: VALID_CONFIRM_PASSWORD,
          verificationCode: VERIFICATION_CODE,
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Provide all required fields');
    });

    test('No password provided; should return 400', async () => {
      await request(app)
        .post('/api/users/confirmSignup')
        .set('Content-Type', 'application/json')
        .send({ email: VALID_EMAIL, passwordConfirm: VALID_CONFIRM_PASSWORD, verificationCode: VERIFICATION_CODE })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Provide all required fields');
    });

    test('No passwordConfirm provided; should return 400', async () => {
      await request(app)
        .post('/api/users/confirmSignup')
        .set('Content-Type', 'application/json')
        .send({ email: VALID_EMAIL, password: VALID_PASSWORD, verificationCode: VERIFICATION_CODE })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Provide all required fields');
    });

    test('No verificationCode provided; should return 400', async () => {
      await request(app)
        .post('/api/users/confirmSignup')
        .set('Content-Type', 'application/json')
        .send({ email: VALID_EMAIL, password: VALID_PASSWORD, passwordConfirm: VALID_CONFIRM_PASSWORD })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Provide all required fields');
    });

    test('Password and passwordConfirm do not match; should return 400', async () => {
      await request(app)
        .post('/api/users/confirmSignup')
        .set('Content-Type', 'application/json')
        .send({
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
          passwordConfirm: INVALID_CONFIRM_PASSWORD,
          verificationCode: VERIFICATION_CODE,
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect(
          (res: Response) => (res.body as ApiResponseError).message === 'Password and password confirm do not match'
        );
    });

    test('Invalid email; should return 400', async () => {
      await request(app)
        .post('/api/users/confirmSignup')
        .set('Content-Type', 'application/json')
        .send({
          email: INVALID_EMAIL,
          password: VALID_PASSWORD,
          passwordConfirm: VALID_CONFIRM_PASSWORD,
          verificationCode: VERIFICATION_CODE,
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Invalid email address');
    });

    test('Valid credentials provided; return 201', async () => {
      await request(app)
        .post('/api/users/confirmSignup')
        .set('Content-Type', 'application/json')
        .send({
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
          passwordConfirm: VALID_CONFIRM_PASSWORD,
          verificationCode: VERIFICATION_CODE,
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseSuccess).message === 'Account verified');
    });
  });

  describe(`'POST /api/users/login'`, () => {
    test('No email provided; return 400', async () => {
      await request(app)
        .post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send({ password: VALID_PASSWORD })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Provide all required fields');
    });

    test('No password provided; return 400', async () => {
      await request(app)
        .post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send({ email: VALID_EMAIL })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Provide all required fields');
    });

    test('Invalid email; return 400', async () => {
      await request(app)
        .post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send({ email: INVALID_EMAIL, password: VALID_PASSWORD })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Invalid email address');
    });

    test('Valid crendentials; return 200', async () => {
      await request(app)
        .post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send({ email: VALID_EMAIL, password: VALID_PASSWORD })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseSuccess).message === 'Account verified');
    });
  });

  describe(`'GET /api/users/logout'`, () => {
    test('Logout; always return 200', async () => {
      await request(app)
        .get('/api/users/logout')
        .set('Authorization', 'Bearer token')
        .expect(200)
        .expect((res: Response) => (res.body as ApiResponseSuccess).message === 'Logged out');
    });
  });

  describe(`'POST /api/users/forgotPassword'`, () => {
    test('No email provided; return 400', async () => {
      await request(app)
        .post('/api/users/forgotPassword')
        .set('Content-Type', 'application/json')
        .send({})
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Provide all required fields');
    });

    test('Invalid email provided; return 400', async () => {
      await request(app)
        .post('/api/users/forgotPassword')
        .set('Content-Type', 'application/json')
        .send({ email: INVALID_EMAIL })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Invalid email address');
    });

    test('Valid credentials provided; return 200', async () => {
      await request(app)
        .post('/api/users/forgotPassword')
        .set('Content-Type', 'application/json')
        .send({ email: VALID_EMAIL })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseSuccess).message === 'Reset token sent to email');
    });
  });

  describe(`'PATCH /api/users/resetPassword'`, () => {
    test('No password provided; return 400', async () => {
      await request(app)
        .patch('/api/users/resetPassword/token')
        .set('Content-Type', 'application/json')
        .send({ passwordConfirm: VALID_CONFIRM_PASSWORD })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Provide all required fields');
    });

    test('No passwordConfirm provided; return 400', async () => {
      await request(app)
        .patch('/api/users/resetPassword/token')
        .set('Content-Type', 'application/json')
        .send({ password: VALID_PASSWORD })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Provide all required fields');
    });

    test('Password and passwordConfirm do not match; return 400', async () => {
      await request(app)
        .patch('/api/users/resetPassword/token')
        .set('Content-Type', 'application/json')
        .send({ password: VALID_PASSWORD, passwordConfirm: INVALID_CONFIRM_PASSWORD })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect(
          (res: Response) => (res.body as ApiResponseError).message === 'Password and password confirm do not match'
        );
    });

    test('Valid credentials provided; return 200', async () => {
      await request(app)
        .patch('/api/users/resetPassword/token')
        .set('Content-Type', 'application/json')
        .send({ password: VALID_PASSWORD, passwordConfirm: VALID_CONFIRM_PASSWORD })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseSuccess).message === 'Password Reset Successful');
    });
  });

  describe(`'GET /api/users/generateAuthToken'`, () => {
    afterEach(() => {
      MOCK_QUERYREFRESHTOKEN.mockReturnValue({});
      MOCK_VERIFYREFRESHTOKEN.mockReturnValue({});
    });

    test('No refreshToken found in DB; return 500', async () => {
      MOCK_QUERYREFRESHTOKEN.mockReturnValue(Promise.resolve(null));

      await request(app)
        .get('/api/users/generateAuthToken')
        .set('Authorization', 'Bearer token')
        .expect(500)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Internal Error. Please login again');
    });

    test('Legitimate Request; return 201', async () => {
      MOCK_VERIFYREFRESHTOKEN.mockReturnValue({ acc: 1 });
      MOCK_QUERYREFRESHTOKEN.mockReturnValue({ acc: 1, activated: true });

      await request(app)
        .get('/api/users/generateAuthToken')
        .set('Authorization', 'Bearer token')
        .expect(201)
        .expect((res: Response) => (res.body as ApiResponseSuccess).message === 'Auth token generated');
    });

    test('Legitimate Request but tokens not received by client; return 400', async () => {
      MOCK_VERIFYREFRESHTOKEN.mockReturnValue({ acc: 1 });
      MOCK_QUERYREFRESHTOKEN.mockReturnValue({ acc: 2, activated: false });

      await request(app)
        .get('/api/users/generateAuthToken')
        .set('Authorization', 'Bearer token')
        .expect(400)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Resubmit refresh token');
    });

    test('Client has not yet validated RefreshToken; return 400', async () => {
      MOCK_VERIFYREFRESHTOKEN.mockReturnValue({ acc: 1 });
      MOCK_QUERYREFRESHTOKEN.mockReturnValue({ acc: 1, activated: false });

      await request(app)
        .get('/api/users/generateAuthToken')
        .set('Authorization', 'Bearer token')
        .expect(400)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Please verify Refresh Token');
    });

    test('Fraudulent request; return 403', async () => {
      MOCK_VERIFYREFRESHTOKEN.mockReturnValue({ acc: 1 });
      MOCK_QUERYREFRESHTOKEN.mockReturnValue({ acc: 3, activated: true });

      await request(app)
        .get('/api/users/generateAuthToken')
        .set('Authorization', 'Bearer token')
        .expect(403)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Account frozen');
    });
  });
});

describe('PROTECTED Routes', () => {
  describe('PATCH api/users/updatePassword', () => {
    test('No newPassword provided; return 400', async () => {
      await request(app)
        .patch('/api/users/updatePassword')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .send({ newPasswordConfirm: VALID_CONFIRM_PASSWORD, oldPassword: VALID_PASSWORD })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Provide all required fields');
    });

    test('No newPasswordConfirm provided; return 400', async () => {
      await request(app)
        .patch('/api/users/updatePassword')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .send({ oldPassword: VALID_PASSWORD, password: VALID_CONFIRM_PASSWORD })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Provide all required fields');
    });

    test('No oldPassword provided; return 400', async () => {
      await request(app)
        .patch('/api/users/updatePassword')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .send({ newPasswordConfirm: VALID_CONFIRM_PASSWORD, password: VALID_PASSWORD })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Provide all required fields');
    });

    test('New password and newPasswordConfirm do not match; return 400', async () => {
      await request(app)
        .patch('/api/users/updatePassword')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .send({
          newPassword: VALID_PASSWORD,
          newPasswordConfirm: INVALID_CONFIRM_PASSWORD,
          oldPassword: VALID_PASSWORD,
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect(
          (res: Response) => (res.body as ApiResponseError).message === 'Password and password confirm do not match'
        );
    });

    test('Valid credentials provided; return 200', async () => {
      await request(app)
        .patch('/api/users/updatePassword')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .send({ newPassword: VALID_PASSWORD, newPasswordConfirm: VALID_CONFIRM_PASSWORD, oldPassword: VALID_PASSWORD })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseSuccess).message === 'Password updated');
    });
  });

  describe('PATCH api/users/freezeAccount', () => {
    test('Valid credentials provided; return 204', async () => {
      await request(app)
        .patch('/api/users/freezeAccount')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .send()
        .expect(204);
    });
  });

  describe('PATCH api/users/deleteAccount', () => {
    test('No password provided; return 400', async () => {
      await request(app)
        .patch('/api/users/deleteAccount')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .send()
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Provide all required fields');
    });

    test('Valid credentials provided; return 204', async () => {
      await request(app)
        .patch('/api/users/deleteAccount')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .send({ password: VALID_PASSWORD })
        .expect(204);
    });
  });

  describe('GET api/users/activateRefreshToken', () => {
    test('Valid credentials provided; return 204', async () => {
      await request(app)
        .get('/api/users/activateRefreshToken')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .send()
        .expect(204);
    });

    test('Invalid credentials provided; return 401', async () => {
      await request(app)
        .get('/api/users/activateRefreshToken')
        .set('Content-Type', 'application/json')
        .expect(401)
        .expect((res: Response) => (res.body as ApiResponseError).message === 'Unauthorized');
    });
  });
});

describe('RESTRICTED Routes', () => {
  describe('GET api/users/restricted', () => {
    afterEach(() => {
      MOCK_QUERYUSERBYID.mockReturnValue(mockUser());
      MOCK_VERIFYAUTHTOKEN.mockReturnValue({});
    });

    test('Valid credentials provided; return 204', async () => {
      MOCK_QUERYUSERBYID.mockReturnValue(mockUser({ role: 'ADMIN' }));
      MOCK_VERIFYAUTHTOKEN.mockReturnValue({ role: 'ADMIN' });

      await request(app)
        .get('/api/users/restricted')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res: Response) => (res.body as ApiResponseSuccess).message === 'Restricted Route Accessed');
    });

    test('Invalid credentials provided; return 403', async () => {
      await request(app)
        .get('/api/users/restricted')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .expect(403);
    });
  });
});
