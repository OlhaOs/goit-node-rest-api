import User from '../db/models/Contact.js';

export const listContacts = () => User.findAll();

export const getContactById = id => User.findByPk(id);

export const removeContact = async id => {
  const contact =await User.findByPk(id);
  if (!contact) {
    return null;
  }

  await User.destroy({ where: { id } });
  return contact;
};

export const addContact = data => User.create(data);

export const updateById = async (id, data) => {
  const [_, [updatedContact]] = await User.update(data, {
    where: { id },
    returning: true,
  });

  if (!updatedContact) {
    return null;
  }

  return updatedContact;
};

export const updateStatusContact = async (id, { favorite }) => {
  const [updated] = await User.update(
    { favorite },
    {
      where: { id },
      returning: true,
    }
  );
  if (updated) {
    return User.findByPk(id);
  }
  return null;
};
