import Joi from 'joi';
import { emailRegexp } from '../constants/authConstants.js';

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().pattern(emailRegexp),
  phone: Joi.string(),
  favorite: Joi.boolean(),
})
  .min(1)
  .messages({
    'object.min': 'Body must have at least one field',
  });

export const updateFavoritesSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().pattern(emailRegexp),
  phone: Joi.string(),
  favorite: Joi.boolean().required(),
}).messages({
  'boolean.base': 'Field "favorite" must be a boolean',
});
