import { nanoid } from 'nanoid';
import fs from 'node:fs/promises';
import path from 'node:path';

const contactsPath = path.resolve('db', 'contacts.json');

export const listContacts = async () => {
  const data = await fs.readFile(contactsPath, 'utf-8');
  return JSON.parse(data);
};

export const getContactById = async contactId => {
  const contactsAll = await listContacts();
  const result = contactsAll.find(contact => contact.id === contactId);
  return result || null;
};

export const removeContact = async contactId => {
  const contactsAll = await listContacts();

  const index = contactsAll.findIndex(contact => contact.id === contactId);
  if (index === -1) {
    return null;
  }

  const [result] = contactsAll.splice(index, 1);

  await fs.writeFile(contactsPath, JSON.stringify(contactsAll, null, 2));

  return result;
};

export const addContact = async data => {
  const contactsAll = await listContacts();

  const newContact = {
    id: nanoid(),
    ...data,
  };

  contactsAll.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contactsAll, null, 2));

  return newContact;
};

export const updateById = async (id, data) => {
  const contactsAll = await listContacts();

  const index = contactsAll.findIndex(item => item.id === id);
  if (index === -1) {
    return null;
  }

  contactsAll[index] = { ...contactsAll[index], ...data };
  await fs.writeFile(contactsPath, JSON.stringify(contactsAll, null, 2));
  return contactsAll[index];
};
