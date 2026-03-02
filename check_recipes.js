const { db } = require('./server/database.js');
const recipes = db.prepare('SELECT title FROM recipes').all();
console.log(JSON.stringify(recipes.map(r => r.title), null, 2));
const categories = db.prepare('SELECT name FROM categories').all();
console.log("Existing categories:", categories.map(c => c.name));
