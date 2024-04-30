const models = require('../models');

const { Sword } = models;

const makerPage = async (req, res) => res.render('app');

const makeSword = async (req, res) => {
  if (!req.body.name || !req.body.sharpness || !req.body.level) {
    return res.status(400).json({ error: 'Name, sharpness and level are all required!' });
  }

  const swordData = {
    name: req.body.name,
    sharpness: req.body.sharpness,
    level: req.body.level,
    owner: req.session.account._id,
  };

  try {
    const newSword = new Sword(swordData);
    await newSword.save();
    return res.status(201).json({ name: newSword.name, sharpness: newSword.sharpness,
       level: newSword.level });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Sword already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making sword!' });
  }
};

const getSwords = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Sword.find(query).select('name sharpness level').lean().exec();

    return res.json({ swords: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving swords!' });
  }
};

module.exports = {
  makerPage,
  makeSword,
  getSwords,
};
