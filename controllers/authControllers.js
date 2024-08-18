import * as authServices from '../services/authServices.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import ctrlWrapper from '../helpers/ctrlWrapper.js';

import HttpError from '../helpers/HttpError.js';

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const newUser = await authServices.signup(req.body);

  res
    .status(201)
    .json({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await authServices.findUser({ email });

  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

  res.json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
};
