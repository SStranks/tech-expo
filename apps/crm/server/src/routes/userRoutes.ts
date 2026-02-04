import type { NextFunction, Request, Response } from 'express';

import express from 'express';

import authController from '#Controllers/authController.js';

const router = express.Router();

// Public
router.post('/signup', authController.signup);
router.post('/confirmSignup', authController.confirmSignup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.get('/generateAuthToken', authController.generateAuthToken);

// Protected
router.use(authController.protectedRoute);
router.patch('/updatePassword', authController.updatePassword);
router.patch('/freezeAccount', authController.freezeAccount);
router.patch('/deleteAccount', authController.deleteAccount);
router.get('/activateRefreshToken', authController.activateRefreshToken);
router.get('/identify', authController.identify);

// Restricted
router.use(authController.restrictedRoute('ROOT', 'ADMIN'));
router.get('/restricted', (_req: Request, res: Response, _next: NextFunction) => {
  res.status(200).json({ status: 'success', message: 'Restricted Route Accessed' });
});
// router
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.forceDeleteUser);

export default router;
