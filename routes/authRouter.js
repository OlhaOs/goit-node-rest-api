import { Router } from 'express';
import upload from '../middleware/upload.js';
import authControllers from '../controllers/authControllers.js';

import authenticate from '../middleware/authenticate.js';

import validateBody from '../helpers/validateBody.js';

import { authSignupSchemas } from '../schemas/authSchemas.js';

const signupMiddleware = validateBody(authSignupSchemas);

const authRouter = Router();

authRouter.post(
  '/register',
  upload.single('avatar'),
  signupMiddleware,
  authControllers.signup
);

authRouter.post('/login', signupMiddleware, authControllers.signin);
authRouter.post('/logout', authenticate, authControllers.signout);
authRouter.get('/current', authenticate, authControllers.getCurrent);

authRouter.patch(
  '/avatars',
   authenticate, upload.single('avatar'),
  authControllers.avatarUpdate
);
export default authRouter;
