const { executeQuery } = require('../database');

/**
 * CategoryRepository encapsulates the data access logic.
 * It strictly performs DB operations returning standard JS primitives.
 */
class CategoryRepository {
    async findAll() {
        return executeQuery('SELECT * FROM categories');
    }

    async findById(id) {
        const rows = await executeQuery('SELECT * FROM categories WHERE id = $1', [id]);
        return rows[0] || null;
    }

    async create(name) {
        return executeQuery('INSERT INTO categories (name) VALUES ($1) RETURNING id', [name]);
    }

    async deleteById(id) {
        return executeQuery('DELETE FROM categories WHERE id = $1', [id]);
    }
}

module.exports = new CategoryRepository();
