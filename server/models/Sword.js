const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();
const setEnchantment = (enchantment) => _.escape(enchantment).trim();

const SwordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  sharpness: {
    type: Number,
    min: 0,
    required: true,
  },
  level: {
    type: Number,
    min: 0,
    required: true,
  },
  enchantment: {
    type: String,
    required: true,
    trim: true,
    set: setEnchantment,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

SwordSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  sharpness: doc.sharpness,
  level: doc.level,
  enchantment: doc.enchantment,
});

const SwordModel = mongoose.model('Sword', SwordSchema);
module.exports = SwordModel;
