const Contact = require("../models/contacts");

const getAll = async (userId) => {
  return Contact.find({ owner: userId });
};

const getOne = async (id, userId) => {
  return Contact.findOne({ _id: id, owner: userId });
};

const create = async (data, userId) => {
  return Contact.create({ ...data, owner: userId });
};

const update = async (id, data, userId) => {
  return Contact.findOneAndUpdate({ _id: id, owner: userId }, data, {
    new: true,
  });
};

const updateFavorite = async (id, favorite, userId) => {
  return Contact.findOneAndUpdate(
    { _id: id, owner: userId },
    { favorite },
    {
      new: true,
    }
  );
};

const remove = async (id, userId) => {
  return Contact.findOneAndDelete({ _id: id, owner: userId });
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  updateFavorite,
  remove,
};
