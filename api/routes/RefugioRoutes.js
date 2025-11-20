const express = require('express');
const route = express.Router();

const Refugio = require('../models/Refugio');

// Crear refugio
route.post('/', async (req, resp) => {
    const {
        nombre,
        descripcion,
        fechaFundacion,
        capacidad,
        correo,
        telefono
    } = req.body;

    const nuevoRefugio = new Refugio({
        nombre,
        descripcion,
        fechaFundacion,
        capacidad,
        correo,
        telefono
    });

    try {
        const guardado = await nuevoRefugio.save();
        resp.status(201).json(guardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// Actualizar refugio
route.put('/:id', async (req, resp) => {
    try {
        const actualizado = await Refugio.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!actualizado) {
            return resp.status(404).json({ mensaje: "Refugio no encontrado" });
        }

        resp.status(200).json(actualizado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// Eliminar refugio
route.delete('/:id', async (req, resp) => {
    try {
        const eliminado = await Refugio.findByIdAndDelete(req.params.id);

        if (!eliminado) {
            return resp.status(404).json({ mensaje: "Refugio no encontrado" });
        }

        resp.status(200).json({ mensaje: "Refugio eliminado" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// Obtener todos
route.get('/', async (req, resp) => {
    try {
        const datos = await Refugio.find();
        resp.json(datos);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

// Obtener por ID
route.get('/:id', async (req, resp) => {
    try {
        const dato = await Refugio.findById(req.params.id);

        if (!dato) {
            return resp.status(404).json({ mensaje: "Refugio no encontrado" });
        }

        resp.json(dato);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

module.exports = route;
