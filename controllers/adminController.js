const multer = require('multer');
const { database, ref, child, get, set, push, remove } = require('../config/firebase');
const { ref: storageRef, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');

const upload = multer({ storage: multer.memoryStorage() });

// Admin Dashboard
exports.getAdminDashboard = async (req, res) => {
    try {
        const productsRef = ref(database, 'products');
        const snapshot = await get(productsRef);
        const productsData = snapshot.val() || {};
        const products = Object.keys(productsData).map(key => ({
            id: key,
            ...productsData[key]
        }));
        
        res.render('admin/admin', { products });
    } catch (error) {
        console.error('Error fetching products', error);
        res.status(500).send('Server Error');
    }
};

exports.getProductsPage = async (req, res) => {
    try {
        const productsRef = ref(database, 'products');
        const snapshot = await get(productsRef);
        const productsData = snapshot.val() || {};
        const products = Object.keys(productsData).map(key => ({
            id: key,
            ...productsData[key]
        }));
        
        res.render('admin/products', { products });
    } catch (error) {
        console.error('Error fetching products for products page', error);
        res.status(500).send('Server Error');
    }
};

exports.addProduct = async (req, res) => {
    try {
        const { name, price, description, exclusive, rating } = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            console.error('No file uploaded.');
            return res.status(400).send('No file uploaded.');
        }

        // Create a reference to 'products' in Storage and upload the file
        const storageReference = storageRef(storage, `products/${Date.now()}_${imageFile.originalname}`);
        await uploadBytes(storageReference, imageFile.buffer);
        const imageUrl = await getDownloadURL(storageReference);

        // Create a reference in the Database and set the product data
        const newProductRef = push(ref(database, 'products'));
        await set(newProductRef, {
            name, 
            price, 
            description, 
            imageUrl, 
            exclusive, 
            rating
        });

        res.redirect('/admin');
    } catch (error) {
        console.error('Error adding product details:', error);
        res.status(500).send('Error adding product.');
    }
};

// Get Edit Product Page
exports.getEditProductPage = async (req, res) => {
    try {
        const { id } = req.params;
        const productRef = ref(database, `products/${id}`);
        const snapshot = await get(productRef);
        const product = snapshot.val();

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.render('admin/edit-product', { product, id }); // Render edit-product.ejs
    } catch (error) {
        console.error('Error fetching product for edit', error);
        res.status(500).send('Server Error');
    }
};

// Edit Product
exports.editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, exclusive, rating } = req.body;
        const imageFile = req.file;

        let updatedProduct = { name, price, description, exclusive, rating };

        if (imageFile) {
            // Upload new image if provided
            const storageReference = storageRef(storage, `products/${Date.now()}_${imageFile.originalname}`);
            await uploadBytes(storageReference, imageFile.buffer);
            const imageUrl = await getDownloadURL(storageReference);
            updatedProduct.imageUrl = imageUrl;
        }

        const productRef = ref(database, `products/${id}`);
        await set(productRef, updatedProduct);

        res.redirect('/admin/products');
    } catch (error) {
        console.error('Error updating product details', error);
        res.status(500).send('Error updating product.');
    }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productRef = ref(database, `products/${id}`);
        
        const snapshot = await get(productRef);
        const product = snapshot.val();
        
        if (product && product.imageUrl) {
            const imageRef = storageRef(storage, product.imageUrl);
            await deleteObject(imageRef); 
        }
        
        await remove(productRef); 
        res.redirect('/admin');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Error deleting product.');
    }
};

// Users 
exports.showUsers = async (req, res) => {
    try {
        const dbRef = ref(database); // Use the imported database instance
        const snapshot = await get(child(dbRef, 'users')); // Get data from 'users' node

        if (snapshot.exists()) {
            const usersData = snapshot.val(); // Retrieve data
            const users = Object.keys(usersData).map(userId => ({
                id: userId,
                ...usersData[userId]
            }));
            res.render('admin/users', { users });
        } else {
            res.render('admin/users', { users: [] }); // No data available
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
};

exports.upload = upload;