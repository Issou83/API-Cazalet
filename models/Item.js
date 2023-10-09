const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;

  