const { database } = require('../config/firebase');
const { ref, get } = require('firebase/database');

// Render Products Page
exports.getProductsPage = async (req, res) => {
    const productsRef = ref(database, 'products');
    const snapshot = await get(productsRef);
    const products = snapshot.val() || {};
    res.render('products', { products: Object.keys(products).map(key => ({ id: key, ...products[key] })) });
};