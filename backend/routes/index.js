const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { body } = require('express-validator');
const materiController = require('../controllers/MateriController');

// Validation rule for create
const validateMateri = [
    body('judul').notEmpty().withMessage('Title is required'),
    body('deskripsi').notEmpty().withMessage('Content is required'),
];

router.get('/materi', materiController.findMateris);
router.post('/materi', upload.single('image'), validateMateri, materiController.createMateri);
router.get('/materi/:id', materiController.findMateriById);
router.put('/materi/:id', upload.single('image'), validateMateri, materiController.updateMateri);
router.delete('/materi/:id', materiController.deleteMateri);

module.exports = router;
