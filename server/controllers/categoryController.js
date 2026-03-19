const categoryService = require('../services/categoryService');
const asyncHandler = require('../utils/asyncWrapper');

exports.getAllCategories = asyncHandler(async (req, res) => {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
});

exports.createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const result = await categoryService.createCategory(name);
    res.json(result);
});

exports.deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await categoryService.deleteCategory(id);
    res.json(result);
});

exports.updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const result = await categoryService.updateCategory(id, name);
    res.json(result);
});
