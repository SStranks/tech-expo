import { describe, jest, test } from '@jest/globals';
import request from 'supertest';

const MOCKED_QUERYREFRESHTOKEN = jest.fn(() => ({}));
const MOCKED_QUERYUSERBYID = jest.fn(() => ({}));
const MOCKED_VERIFYAUTHTOKEN = jest.fn(() => ({}));
const MOCKED_VERIFYREFRESHTOKEN = jest.fn(() => ({}));

jest.unstable_mockModule('@apollo/server/express4', () => ({
  __esModule: true,
  expressMiddleware: () => jest.fn(),
}));
jest.unstable_mockModule('#Graphql/apolloServer.ts', () => ({
  __esModule: true,
  apolloServer: jest.fn(),
}));
jest.unstable_mockModule('#Services/index', () => ({
  __esModule: true,
  NodeMailerService: {
    sendAccountVerificationEmail: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  },
  UserService: {
    activateRefreshToken: jest.fn(),
    advanceRefreshToken: jest.fn(),
    blacklistAllRefreshTokens: jest.fn(),
    blacklistToken: jest.fn(),
    clearCookies: jest.fn(),
    createAuthCookie: jest.fn(),
    createRefreshCookie: jest.fn(),
    decodeAuthToken: jest.fn().mockReturnValue({}),
    deleteAccount: jest.fn(),
    deleteAllRefreshTokens: jest.fn().mockReturnValue({}),
    forgotPassword: jest.fn().mockReturnValue(''),
    freezeAccount: jest.fn(),
    generateClientTokens: jest.fn().mockReturnValue({}),
    insertRefreshToken: jest.fn(),
    insertUser: jest.fn(),
    isExistingAccount: jest.fn(),
    isPasswordValid: jest.fn(),
    isResetTokenValid: jest.fn().mockReturnValue({}),
    isTokenBlacklisted: jest.fn(),
    loginAccount: jest.fn(),
    logoutAccount: jest.fn().mockReturnValue(Promise.resolve()),
    queryRefreshToken: MOCKED_QUERYREFRESHTOKEN,
    queryUserByEmail: jest.fn().mockReturnValue({}),
    queryUserById: MOCKED_QUERYUSERBYID,
    resetPassword: jest.fn(),
    signAuthToken: jest.fn(),
    updatePassword: jest.fn(),
    updateRefreshToken: jest.fn(),
    verifyAccount: jest.fn(),
    verifyAuthToken: MOCKED_VERIFYAUTHTOKEN,
    verifyRefreshToken: MOCKED_VERIFYREFRESHTOKEN,
  },
}));

const { default: app } = await import('#App/app');

const VALID_EMAIL = 'valid@email.com';
const INVALID_EMAIL = 'invalid@email';
const VALID_PASSWORD = 'password';
const VALID_CONFIRM_PASSWORD = 'password';
const INVALID_CONFIRM_PASSWORD = 'pass';
const VERIFICATION_CODE = '123456';

const REQUEST = request(app);

describe('PUBLIC Routes', () => {
  describe(`'POST /api/users/signup'`, () => {
    test('No email provided; should return 400', async () => {
      return REQUEST.post('/api/users/signup')
        .set('Content-Type', 'application/json')
        .send({})
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Provide all required fields');
    });

    test('Invalid email provided; should return 401', () => {
      return REQUEST.post('/api/users/signup')
        .set('Content-Type', 'application/json')
        .send({ email: INVALID_EMAIL })
        .expect(401)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Invalid email address');
    });

    test('Valid email provided; should return 200', () => {
      return REQUEST.post('/api/users/signup')
        .set('Content-Type', 'application/json')
        .send({ email: VALID_EMAIL })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Signup email with verification code sent');
    });
  });

  describe('POST /api/users/confirmSignup', () => {
    test('No email provided; should return 400', () => {
      return REQUEST.post('/api/users/confirmSignup')
        .set('Content-Type', 'application/json')
        .send({
          password: VALID_PASSWORD,
          passwordConfirm: VALID_CONFIRM_PASSWORD,
          verificationCode: VERIFICATION_CODE,
        })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Provide all required fields');
    });

    test('No password provided; should return 400', () => {
      return REQUEST.post('/api/users/confirmSignup')
        .set('Content-Type', 'application/json')
        .send({ email: VALID_EMAIL, passwordConfirm: VALID_CONFIRM_PASSWORD, verificationCode: VERIFICATION_CODE })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Provide all required fields');
    });

    test('No passwordConfirm provided; should return 400', () => {
      return REQUEST.post('/api/users/confirmSignup')
        .set('Content-Type', 'application/json')
        .send({ email: VALID_EMAIL, password: VALID_PASSWORD, verificationCode: VERIFICATION_CODE })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Provide all required fields');
    });

    test('No verificationCode provided; should return 400', () => {
      return REQUEST.post('/api/users/confirmSignup')
        .set('Content-Type', 'application/json')
        .send({ email: VALID_EMAIL, password: VALID_PASSWORD, passwordConfirm: VALID_CONFIRM_PASSWORD })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Provide all required fields');
    });

    test('Password and passwordConfirm do not match; should return 401', () => {
      return REQUEST.post('/api/users/confirmSignup')
        .set('Content-Type', 'application/json')
        .send({
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
          passwordConfirm: INVALID_CONFIRM_PASSWORD,
          verificationCode: VERIFICATION_CODE,
        })
        .expect(401)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Password and password confirm do not match');
    });

    test('Invalid email; should return 401', () => {
      return REQUEST.post('/api/users/confirmSignup')
        .set('Content-Type', 'application/json')
        .send({
          email: INVALID_EMAIL,
          password: VALID_PASSWORD,
          passwordConfirm: VALID_CONFIRM_PASSWORD,
          verificationCode: VERIFICATION_CODE,
        })
        .expect(401)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Invalid email address');
    });

    test('Valid credentials provided; return 201', () => {
      return REQUEST.post('/api/users/confirmSignup')
        .set('Content-Type', 'application/json')
        .send({
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
          passwordConfirm: VALID_CONFIRM_PASSWORD,
          verificationCode: VERIFICATION_CODE,
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Account verified');
    });
  });

  describe(`'POST /api/users/login'`, () => {
    test('No email provided; return 400', () => {
      return REQUEST.post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send({ password: VALID_PASSWORD })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Provide all required fields');
    });

    test('No password provided; return 400', () => {
      return REQUEST.post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send({ email: VALID_EMAIL })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Provide all required fields');
    });

    test('Invalid email; return 401', () => {
      return REQUEST.post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send({ email: INVALID_EMAIL, password: VALID_PASSWORD })
        .expect(401)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Invalid email address');
    });

    test('Valid crendentials; return 200', () => {
      return REQUEST.post('/api/users/login')
        .set('Content-Type', 'application/json')
        .send({ email: VALID_EMAIL, password: VALID_PASSWORD })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Account verified');
    });
  });

  describe(`'GET /api/users/logout'`, () => {
    test('Logout; always return 200', () => {
      return REQUEST.get('/api/users/logout')
        .set('Authorization', 'Bearer token')
        .expect(200)
        .expect((res) => res.body.message === 'Logged out');
    });
  });

  describe(`'POST /api/users/forgotPassword'`, () => {
    test('No email provided; return 400', () => {
      return REQUEST.post('/api/users/forgotPassword')
        .set('Content-Type', 'application/json')
        .send({})
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Provide all required fields');
    });

    test('Invalid email provided; return 401', () => {
      return REQUEST.post('/api/users/forgotPassword')
        .set('Content-Type', 'application/json')
        .send({ email: INVALID_EMAIL })
        .expect(401)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Invalid email address');
    });

    test('Valid credentials provided; return 200', () => {
      return REQUEST.post('/api/users/forgotPassword')
        .set('Content-Type', 'application/json')
        .send({ email: VALID_EMAIL })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Reset token sent to email');
    });
  });

  describe(`'PATCH /api/users/resetPassword'`, () => {
    test('No password provided; return 400', () => {
      return REQUEST.patch('/api/users/resetPassword/token')
        .set('Content-Type', 'application/json')
        .send({ passwordConfirm: VALID_CONFIRM_PASSWORD })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Provide all required fields');
    });

    test('No passwordConfirm provided; return 400', () => {
      return REQUEST.patch('/api/users/resetPassword/token')
        .set('Content-Type', 'application/json')
        .send({ password: VALID_PASSWORD })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Provide all required fields');
    });

    test('Password and passwordConfirm do not match; return 401', () => {
      return REQUEST.patch('/api/users/resetPassword/token')
        .set('Content-Type', 'application/json')
        .send({ password: VALID_PASSWORD, passwordConfirm: INVALID_CONFIRM_PASSWORD })
        .expect(401)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Password and password confirm do not match');
    });

    test('Valid credentials provided; return 200', () => {
      return REQUEST.patch('/api/users/resetPassword/token')
        .set('Content-Type', 'application/json')
        .send({ password: VALID_PASSWORD, passwordConfirm: VALID_CONFIRM_PASSWORD })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Password Reset Successful');
    });
  });

  describe(`'GET /api/users/generateAuthToken'`, () => {
    afterEach(() => {
      MOCKED_QUERYREFRESHTOKEN.mockReturnValue({});
      MOCKED_VERIFYREFRESHTOKEN.mockReturnValue({});
    });

    test('No refreshToken found in DB; return 500', async () => {
      MOCKED_QUERYREFRESHTOKEN.mockReturnValue(Promise.resolve(null));

      return REQUEST.get('/api/users/generateAuthToken')
        .set('Authorization', 'Bearer token')
        .expect(500)
        .expect((res) => res.body.message === 'Internal Error. Please login again');
    });

    test('Legitimate Request; return 201', () => {
      MOCKED_VERIFYREFRESHTOKEN.mockReturnValue({ acc: 1 });
      MOCKED_QUERYREFRESHTOKEN.mockReturnValue({ acc: 1, activated: true });

      return REQUEST.get('/api/users/generateAuthToken')
        .set('Authorization', 'Bearer token')
        .expect(201)
        .expect((res) => res.body.message === 'Auth token generated');
    });

    test('Legitimate Request but tokens not received by client; return 401', () => {
      MOCKED_VERIFYREFRESHTOKEN.mockReturnValue({ acc: 1 });
      MOCKED_QUERYREFRESHTOKEN.mockReturnValue({ acc: 2, activated: false });

      return REQUEST.get('/api/users/generateAuthToken')
        .set('Authorization', 'Bearer token')
        .expect(401)
        .expect((res) => res.body.message === 'Resubmit refresh token');
    });

    test('Client has not yet validated RefreshToken; return 401', () => {
      MOCKED_VERIFYREFRESHTOKEN.mockReturnValue({ acc: 1 });
      MOCKED_QUERYREFRESHTOKEN.mockReturnValue({ acc: 1, activated: false });

      return REQUEST.get('/api/users/generateAuthToken')
        .set('Authorization', 'Bearer token')
        .expect(401)
        .expect((res) => res.body.message === 'Please verify Refresh Token');
    });

    test('Fraudulent request; return 403', () => {
      MOCKED_VERIFYREFRESHTOKEN.mockReturnValue({ acc: 1 });
      MOCKED_QUERYREFRESHTOKEN.mockReturnValue({ acc: 3, activated: true });

      return REQUEST.get('/api/users/generateAuthToken')
        .set('Authorization', 'Bearer token')
        .expect(403)
        .expect((res) => res.body.message === 'Account frozen');
    });
  });
});

describe('PROTECTED Routes', () => {
  describe('PATCH api/users/updatePassword', () => {
    test('No newPassword provided; return 400', () => {
      return REQUEST.patch('/api/users/updatePassword')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .send({ newPasswordConfirm: VALID_CONFIRM_PASSWORD, oldPassword: VALID_PASSWORD })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Provide all required fields');
    });

    test('No newPasswordConfirm provided; return 400', () => {
      return REQUEST.patch('/api/users/updatePassword')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .send({ oldPassword: VALID_PASSWORD, password: VALID_CONFIRM_PASSWORD })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Provide all required fields');
    });

    test('No oldPassword provided; return 400', () => {
      return REQUEST.patch('/api/users/updatePassword')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .send({ newPasswordConfirm: VALID_CONFIRM_PASSWORD, password: VALID_PASSWORD })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Provide all required fields');
    });

    test('New password and newPasswordConfirm do not match; return 401', () => {
      return REQUEST.patch('/api/users/updatePassword')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .send({
          newPassword: VALID_PASSWORD,
          newPasswordConfirm: INVALID_CONFIRM_PASSWORD,
          oldPassword: VALID_PASSWORD,
        })
        .expect(401)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Password and password confirm do not match');
    });

    test('Valid credentials provided; return 200', () => {
      return REQUEST.patch('/api/users/updatePassword')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .send({ newPassword: VALID_PASSWORD, newPasswordConfirm: VALID_CONFIRM_PASSWORD, oldPassword: VALID_PASSWORD })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Password updated');
    });
  });

  describe('PATCH api/users/freezeAccount', () => {
    test('Valid credentials provided; return 204', () => {
      return REQUEST.patch('/api/users/freezeAccount')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .send()
        .expect(204);
    });
  });

  describe('PATCH api/users/deleteAccount', () => {
    test('No password provided; return 400', () => {
      return REQUEST.patch('/api/users/deleteAccount')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .send()
        .expect(400)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Provide all required fields');
    });

    test('Valid credentials provided; return 204', () => {
      return REQUEST.patch('/api/users/deleteAccount')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .send({ password: VALID_PASSWORD })
        .expect(204);
    });
  });

  describe('GET api/users/activateRefreshToken', () => {
    test('Valid credentials provided; return 204', () => {
      return REQUEST.get('/api/users/activateRefreshToken')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .send()
        .expect(204);
    });

    test('Invalid credentials provided; return 401', () => {
      return REQUEST.get('/api/users/activateRefreshToken')
        .set('Content-Type', 'application/json')
        .expect(401)
        .expect((res) => res.body.message === 'Unauthorized');
    });
  });
});

describe('RESTRICTED Routes', () => {
  describe('GET api/users/restricted', () => {
    afterEach(() => {
      MOCKED_QUERYUSERBYID.mockReturnValue({});
      MOCKED_VERIFYAUTHTOKEN.mockReturnValue({});
    });

    test('Valid credentials provided; return 204', () => {
      MOCKED_QUERYUSERBYID.mockReturnValue({ role: 'ADMIN' });
      MOCKED_VERIFYAUTHTOKEN.mockReturnValue({ role: 'ADMIN' });

      return REQUEST.get('/api/users/restricted')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => res.body.message === 'Restricted Route Accessed');
    });

    test('Invalid credentials provided; return 403', () => {
      return REQUEST.get('/api/users/restricted')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token')
        .expect(403);
    });
  });
});
