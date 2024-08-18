import Contact from '../db/models/Contact.js';

export const listContacts = () => Contact.findAll();

export const getContactById = id => Contact.findByPk(id);

export const removeContact = async id => {
  const contact =await Contact.findByPk(id);
  if (!contact) {
    return null;
  }

  await Contact.destroy({ where: { id } });
  return contact;
};

export const addContact = data => Contact.create(data);

export const updateById = async (id, data) => {
  const [_, [updatedContact]] = await Contact.update(data, {
    where: { id },
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
