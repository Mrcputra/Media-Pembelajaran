const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { body } = require('express-validator');
const postController = require('../controllers/PostController');

// Validation rule for create
const validatePost = [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
];

router.get('/posts', postController.findPosts);
router.post('/posts', upload.single('image'), validatePost, postController.createPost);
router.get('/posts/:id', postController.findPostById);
router.put('/posts/:id', upload.single('image'), validatePost, postController.updatePost);
router.delete('/posts/:id', postController.deletePost);

module.exports = router;
