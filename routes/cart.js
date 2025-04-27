const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @route   GET api/cart
// @desc    Get user's cart
router.get('/', async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart) {
            return res.json({ items: [], total: 0 });
        }
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/cart
// @desc    Add item to cart
router.post('/', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        let cart = await Cart.findOne({ user: req.user.id });
        
        if (!cart) {
            cart = new Cart({
                user: req.user.id,
                items: []
            });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        await cart.populate('items.product');
        
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/cart/:itemId
// @desc    Update cart item quantity
router.put('/:itemId', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user.id });
        
        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.itemId);
        
        if (itemIndex === -1) {
            return res.status(404).json({ msg: 'Item not found in cart' });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        await cart.populate('items.product');
        
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/cart/:itemId
// @desc    Remove item from cart
router.delete('/:itemId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        
        if (!cart) {
            return res.status(404).json({ msg: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
        await cart.save();
        await cart.populate('items.product');
        
        res.json(cart);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router; 