const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   GET api/products
// @desc    Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/products/search
// @desc    Search products
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/products/:id
// @desc    Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server error');
    }
});

module.exports = router; 