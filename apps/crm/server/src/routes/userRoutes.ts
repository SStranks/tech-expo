import express, { NextFunction, Request, Response } from 'express';

import { authController } from '#Controllers/index';

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

// Restricted
router.use(authController.restrictedRoute('ROOT', 'ADMIN'));
router.get('/restricted', (_req: Request, res: Response, _next: NextFunction) => {
  res.status(200).json({ message: 'Restricted Route Accessed', status: 'success' });
});
// router
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.forceDeleteUser);

export default router;
