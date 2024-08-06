import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateById,
  updateStatusContact,
} from '../services/contactsServices.js';

import ctrlWrapper from '../helpers/ctrlWrapper.js';

import HttpError from '../helpers/HttpError.js';

const getAllContacts = async (_, res) => {
  const result = await listContacts();
  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await getContactById(id);

  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await removeContact(id);

  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.json(result);
};

const createContact = async (req, res) => {
  const result = await addContact(req.body);
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const result = await updateById(id, req.body);

  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const updateFavoriteStatus = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;

  if (typeof favorite !== 'boolean') {
    throw HttpError(400, 'Field "favorite" must be a boolean');
  }

  const result = await updateStatusContact(id, { favorite });

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateFavoriteStatus: ctrlWrapper(updateFavoriteStatus),
};
