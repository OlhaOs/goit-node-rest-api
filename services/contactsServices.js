import Contact from '../db/models/Contact.js';

export const listContacts = (query = {}, { page = 1, limit = 10 }) => {
  const normalizedLimit = Number(limit);
  const offset = (Number(page) - 1) * normalizedLimit;
  return Contact.findAll({
    where: query,
    offset,
    limit: normalizedLimit,
  });
};

export const getContact = query => Contact.findOne({ where: query });

export const removeContact = async query => {
  const contact = await getContact(query);
  if (!contact) {
    return null;
  }

  await Contact.destroy({ where: query });
  return contact;
};

export const addContact = data => Contact.create(data);

export const updateContactQuery = async (query, data) => {
  const [_, [updatedContact]] = await Contact.update(data, {
    where: { query },
    returning: true,
  });

  if (!updatedContact) {
    return null;
  }

  return updatedContact;
};

export const updateStatusContact = async (id, { favorite }) => {
  const [updated] = await Contact.update(
    { favorite },
    {
      where: { id },
      returning: true,
    }
  );
  if (updated) {
    return Contact.findByPk(id);
  }
  return null;
};
