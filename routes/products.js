const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { NotFoundError, ValidationError } = require('../middleware/errorHandler');

const router = express.Router();
const products = [];

const validateProduct = (product) => {
    const requiredFields = ['name', 'description', 'price', 'category', 'inStock'];
    for (const field of requiredFields) {
        if (!product[field]) {
            throw new ValidationError(`Missing required field: ${field}`);
        }
    }
    if (typeof product.price !== 'number' || product.price < 0) {
        throw new ValidationError('Price must be a positive number');
    }
    if (typeof product.inStock !== 'boolean') {
        throw new ValidationError('inStock must be a boolean');
    }
};

router.get('/', (req, res) => {
    const { category, page = 1, limit = 10, search } = req.query;
    let filteredProducts = [...products];

    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    if (search) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    res.json({
        total: filteredProducts.length,
        page: parseInt(page),
        data: filteredProducts.slice(startIndex, endIndex)
    });
});

router.get('/:id', (req, res, next) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        throw new NotFoundError('Product not found');
    }
    res.json(product);
});

router.post('/', (req, res, next) => {
    try {
        validateProduct(req.body);
        const newProduct = {
            id: uuidv4(),
            ...req.body
        };
        products.push(newProduct);
        res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', (req, res, next) => {
    try {
        const index = products.findIndex(p => p.id === req.params.id);
        if (index === -1) {
            throw new NotFoundError('Product not found');
        }
        validateProduct(req.body);
        products[index] = { ...products[index], ...req.body };
        res.json(products[index]);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', (req, res, next) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        throw new NotFoundError('Product not found');
    }
    products.splice(index, 1);
    res.status(204).send();
});

router.get('/stats/categories', (req, res) => {
    const stats = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {});
    res.json(stats);
});

module.exports = router;
