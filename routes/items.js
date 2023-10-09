const express = require('express');
const Item = require('../models/Item.js');
const { authenticateToken } = require('./auth.js');

const router = express.Router();

// Route pour récupérer tous les éléments
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route pour ajouter un nouvel élément (nécessite une authentification)
router.post('/', authenticateToken, async (req, res) => {
    const item = new Item({
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl
    });

    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Update an item
router.put('/:id', authenticateToken, (req, res) => {
  const itemId = req.params.id;
  const updatedData = {
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
  };

  Item.findByIdAndUpdate(itemId, updatedData, { new: true })
    .then(updatedItem => res.status(200).json(updatedItem))
    .catch(error => res.status(400).json({ message: 'Error updating item', error }));
});

// Delete an item
router.delete('/:id', authenticateToken, (req, res) => {
  const itemId = req.params.id;

  Item.findByIdAndDelete(itemId)
    .then(() => res.status(200).json({ message: 'Item deleted successfully' }))
    .catch(error => res.status(400).json({ message: 'Error deleting item', error }));
});

module.exports = router;
