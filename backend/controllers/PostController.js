const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Get all posts
const findPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: {
                id: 'desc'
            }
        });

        res.status(200).send({
            success: true,
            message: "Get all posts successfully",
            data: posts
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
};

// Create a post
const createPost = async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array()
        });
    }

    try {
        const post = await prisma.post.create({
            data: {
                title: req.body.title,
                content: req.body.content,
                image: req.file ? req.file.filename : null
            }
        });

        res.status(201).send({
            success: true,
            message: "Post created successfully",
            data: post
        });
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get single post
const findPostById = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await prisma.post.findUnique({
            where: { id: Number(id) }
        });

        if (!post) {
            return res.status(404).send({
                success: false,
                message: "Post not found"
            });
        }

        res.status(200).send({
            success: true,
            message: "Get post successfully",
            data: post
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update a post
const updatePost = async (req, res) => {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array()
        });
    }

    try {
        const post = await prisma.post.findUnique({ where: { id: Number(id) } });

        if (!post) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).send({ success: false, message: "Post not found" });
        }

        let updateData = {
            title: req.body.title,
            content: req.body.content
        };

        if (req.file) {
            updateData.image = req.file.filename;

            // Delete old image
            if (post.image) {
                const oldImagePath = path.join(__dirname, '../public/uploads/', post.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        const updatedPost = await prisma.post.update({
            where: { id: Number(id) },
            data: updateData
        });

        res.status(200).send({
            success: true,
            message: "Post updated successfully",
            data: updatedPost
        });
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
};

// Delete a post
const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await prisma.post.findUnique({ where: { id: Number(id) } });

        if (!post) {
            return res.status(404).send({ success: false, message: "Post not found" });
        }

        // Delete image
        if (post.image) {
            const imagePath = path.join(__dirname, '../public/uploads/', post.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await prisma.post.delete({
            where: { id: Number(id) }
        });

        res.status(200).send({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    findPosts,
    createPost,
    findPostById,
    updatePost,
    deletePost
};
