import * as authServices from '../services/authServices.js';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { listContacts } from '../services/contactsServices.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';

import ctrlWrapper from '../helpers/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';

const { JWT_SECRET } = process.env;
const avatarPath = path.resolve('public', 'avatars');

const signup = async (req, res) => {
  const { email } = req.body;
  const avatarURL = gravatar.url(
    email,
    { s: '200', r: 'pg', d: 'retro' },
    true
  );

  const newUser = await authServices.signup({ ...req.body, avatarURL });

  const { subscription, id } = newUser;

  res.status(201).json({
    user: {
      id,
      subscription,
      email,
      avatarURL,
    },
  });
};
const verify = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await authServices.findUser({ verificationToken });
  if (!user) {
    throw HttpError(404, 'Not found');
  }
  await authServices.updateUser(
    { verificationToken },
    { verify: true, verificationToken: null }
  );

  res.json({ message: 'Verification successful' });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });

  if (!user) {
    throw HttpError(404, 'Email not found');
  }

  if (user.verify) {
    throw HttpError(400, 'Verification has already been passed');
  }

  await authServices.sendVerifyEmail(user.email, user.verificationToken);

  res.json({ message: 'Verification email sent' });
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  const user = await authServices.findUser({ email });

  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }
  if (!user.verify) {
    throw HttpError(401, 'User not found');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

  await authServices.updateUser({ id: user.id }, { token });

  res.json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

const getCurrent = async (req, res) => {
  const { email, id, subscription } = req.user;
  const contacts = await listContacts({ owner: id });

  res.json({
    email,
    subscription,
    contacts,
  });
};

const signout = async (req, res) => {
  const { id } = req.user;
  await authServices.updateUser({ id }, { token: null });

  res.status(204).send();
};

const avatarUpdate = async (req, res) => {
  const { path: oldpath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);

  await fs.rename(oldpath, newPath);

  const avatarURL = path.join('avatars', filename);
  const updateUser = await authServices.updateUser(
    { id: req.user.id },
    { avatarURL }
  );

  res.status(200).json({
    avatarURL: updateUser.avatarURL,
  });
};

export default {
  signup: ctrlWrapper(signup),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  avatarUpdate: ctrlWrapper(avatarUpdate),
  signout,
};
