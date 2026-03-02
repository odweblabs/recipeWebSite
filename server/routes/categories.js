const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { validateBody } = require('../middleware/validator');

// GET all categories
router.get('/', categoryController.getAllCategories);

// POST new category
router.post('/', validateBody(['name']), categoryController.createCategory);

// DELETE category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
