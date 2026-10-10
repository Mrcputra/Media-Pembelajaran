const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Get all materis
const findMateris = async (req, res) => {
    try {
        const materis = await prisma.materi.findMany({
            orderBy: {
                id: 'desc'
            }
        });

        res.status(200).send({
            success: true,
            message: "Get all materis successfully",
            data: materis
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
};

// Create a materi
const createMateri = async (req, res) => {
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
        const materi = await prisma.materi.create({
            data: {
                judul: req.body.judul,
                deskripsi: req.body.deskripsi,
                image: req.file ? req.file.filename : null
            }
        });

        res.status(201).send({
            success: true,
            message: "Materi created successfully",
            data: materi
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

// Get single materi
const findMateriById = async (req, res) => {
    const { id } = req.params;

    try {
        const materi = await prisma.materi.findUnique({
            where: { id: Number(id) }
        });

        if (!materi) {
            return res.status(404).send({
                success: false,
                message: "Materi not found"
            });
        }

        res.status(200).send({
            success: true,
            message: "Get materi successfully",
            data: materi
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update a materi
const updateMateri = async (req, res) => {
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
        const materi = await prisma.materi.findUnique({ where: { id: Number(id) } });

        if (!materi) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).send({ success: false, message: "Materi not found" });
        }

        let updateData = {
            judul: req.body.judul,
            deskripsi: req.body.deskripsi
        };

        if (req.file) {
            updateData.image = req.file.filename;

            // Delete old image
            if (materi.image) {
                const oldImagePath = path.join(__dirname, '../public/uploads/', materi.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        const updatedMateri = await prisma.materi.update({
            where: { id: Number(id) },
            data: updateData
        });

        res.status(200).send({
            success: true,
            message: "Materi updated successfully",
            data: updatedMateri
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

// Delete a materi
const deleteMateri = async (req, res) => {
    const { id } = req.params;

    try {
        const materi = await prisma.materi.findUnique({ where: { id: Number(id) } });

        if (!materi) {
            return res.status(404).send({ success: false, message: "Materi not found" });
        }

        // Delete image
        if (materi.image) {
            const imagePath = path.join(__dirname, '../public/uploads/', materi.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await prisma.materi.delete({
            where: { id: Number(id) }
        });

        res.status(200).send({
            success: true,
            message: "Materi deleted successfully"
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    findMateris,
    createMateri,
    findMateriById,
    updateMateri,
    deleteMateri
};
