const categoryRepo = require('../models/Category');

class CategoryService {
    async getAllCategories() {
        const categories = await categoryRepo.findAll();
        // Sort alphabetically according to Turkish locale
        categories.sort((a, b) => a.name.localeCompare(b.name, 'tr-TR'));
        return categories;
    }

    async createCategory(name) {
        // Validation moved to middleware
        const info = await categoryRepo.create(name);
        return { id: info.lastInsertRowid, name };
    }

    async deleteCategory(id) {
        // Validation moved to middleware
        const info = await categoryRepo.deleteById(id);
        if (info.changes === 0) {
            const err = new Error('Category not found');
            err.statusCode = 404;
            throw err;
        }
        return { message: 'Category deleted' };
    }
}

// Export as singleton
module.exports = new CategoryService();
