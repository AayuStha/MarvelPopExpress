const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

router.get('/', adminController.getAdminDashboard);
router.post('/add-product', adminController.upload.single('imageFile'), adminController.addProduct);
router.post('/delete-product/:id', adminController.deleteProduct);

module.exports = router;