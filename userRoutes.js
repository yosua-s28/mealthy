// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// const upload = require('../config/multer'); // HAPUS INI

router.post('/register', userController.registerUser);
router.get('/', userController.getAllUsers);
router.get('/:userId', userController.getUserById);
// router.put('/:userId', upload.single('profileImage'), userController.updateUser); // Ganti ini
router.put('/:userId', userController.updateUser); // Menjadi ini

module.exports = router;