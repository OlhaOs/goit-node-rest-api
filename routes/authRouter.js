import { Router } from 'express';

import authControllers from '../controllers/authControllers.js';

import validateBody from '../helpers/validateBody.js';

import { authSignupSchemas } from '../schemas/authSchemas.js';

const signupMiddleware = validateBody(authSignupSchemas);

const authRouter = Router();

authRouter.post('/register',  signupMiddleware, authControllers.signup)
authRouter.post('/login',  signupMiddleware, authControllers.signin)

export default authRouter;
