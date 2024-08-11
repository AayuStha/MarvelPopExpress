const multer = require('multer');
const { database, storage } = require('../config/firebase');
const { ref, set, push, get, remove } = require('firebase/database');
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
    
    res.render('admin', { products });
    } catch (error) {
        console.error('Error fetching products', error);
        res.status(500).send('Server Error');
    }
};
    
exports.addProduct = async (req, res) => {
    try {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);
    const { name, price, description, exclusive, rating } = req.body;
    const imageFile = req.file;
    
    if (!imageFile) {
    console.error('No file uploaded.');
    return res.status(400).send('No file uploaded.');
    }
    
    console.log("Uploading to Firebase Storage...");
    const storageReference = storageRef(storage, `products/${Date.now()}_${imageFile.originalname}`);
    await uploadBytes(storageReference, imageFile.buffer);
    const imageUrl = await getDownloadURL(storageReference);
    console.log("File uploaded, URL:", imageUrl);
    
    console.log("Saving product to Firebase Database...");
    const newProductRef = push(ref(database, 'products'));
    await set(newProductRef, { name, price, description, imageUrl, exclusive, rating });
    console.log("Product saved successfully!");
    
    res.redirect('/admin');
    } catch (error) {
    console.error('Error adding product details:', error);
    res.status(500).send('Error adding product.');
    }
};

 
 // Delete Product
 exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productRef = ref(database, `products/${id}`);
        await remove(productRef);
        res.redirect('/admin');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Error deleting product.');
    }
 };
 
 exports.upload = upload;