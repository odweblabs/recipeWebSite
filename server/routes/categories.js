const express = require('express');
const { validateBody } = require('../middleware/validator');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, adminOnly } = require('../middleware/auth');

// GET all categories
router.get('/', categoryController.getAllCategories);

// POST new category
router.post('/', authenticateToken, adminOnly, validateBody(['name']), categoryController.createCategory);

// PUT update category
router.put('/:id', authenticateToken, adminOnly, validateBody(['name']), categoryController.updateCategory);

// DELETE category
router.delete('/:id', authenticateToken, adminOnly, categoryController.deleteCategory);

module.exports = router;
