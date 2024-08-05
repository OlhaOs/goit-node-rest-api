import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import { updateContactSchema, createContactSchema } from "../schemas/contactsSchemas.js";

const createContactMiddleware = validateBody(createContactSchema);
const updateContactMiddleware = validateBody(updateContactSchema)

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", createContactMiddleware, createContact);

contactsRouter.put("/:id", updateContactMiddleware, updateContact);

export default contactsRouter;
