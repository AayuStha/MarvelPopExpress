const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', adminController.getAdminDashboard); // Dashboard route
router.get('/products', adminController.getProductsPage); // Products page route
router.get('/edit-product/:id', adminController.getEditProductPage); // Edit product form route
router.post('/edit-product/:id', adminController.upload.single('imageFile'), adminController.editProduct); // Edit product route
router.post('/add-product', adminController.upload.single('imageFile'), adminController.addProduct); // Add product route
router.post('/delete-product/:id', adminController.deleteProduct); // Delete product route

module.exports = router;
