import express from 'express';
import contactsControllers from '../controllers/contactsControllers.js';

const {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavoriteStatus,
} = contactsControllers;

import validateBody from '../helpers/validateBody.js';
import {
  updateContactSchema,
  createContactSchema,
  updateFavoritesSchema,
} from '../schemas/contactsSchemas.js';

const createContactMiddleware = validateBody(createContactSchema);
const updateContactMiddleware = validateBody(updateContactSchema);
const updateStatusMiddleware = validateBody(updateFavoritesSchema);

const contactsRouter = express.Router();

contactsRouter.get('/', getAllContacts);

contactsRouter.get('/:id', getOneContact);

contactsRouter.delete('/:id', deleteContact);

contactsRouter.post('/', createContactMiddleware, createContact);

contactsRouter.put('/:id', updateContactMiddleware, updateContact);

contactsRouter.patch(
  '/:id/favorite',
  updateStatusMiddleware,
  updateFavoriteStatus
);

export default contactsRouter;
