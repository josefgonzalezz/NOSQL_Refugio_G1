const express = require('express');
const route = express.Router();

const Adopcion = require('../models/Adopcion');

// =======================================
//  CREAR ADOPCIÓN
// =======================================
route.post('/', async (req, resp) => {
    const { idAnimal, idCliente, fechaAdopcion, estado, observaciones } = req.body;

    const nuevaAdopcion = new Adopcion({
        idAnimal,
        idCliente,
        fechaAdopcion,
        estado,
        observaciones
    });

    try {
        const adopcionGuardada = await nuevaAdopcion.save();
        resp.status(201).json(adopcionGuardada);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// =======================================
//  OBTENER UNA ADOPCIÓN POR ID (FALTABA)
// =======================================
route.get('/:id', async (req, resp) => {
    try {
        const adopcion = await Adopcion.findById(req.params.id)
            .populate('idAnimal')
            .populate('idCliente');

        if (!adopcion) {
            return resp.status(404).json({ mensaje: "Adopción no encontrada" });
        }

        resp.status(200).json(adopcion);

    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// =======================================
//  ACTUALIZAR ADOPCIÓN
// =======================================
route.put('/:id', async (req, resp) => {
    try {
        const adopcionActualizada = await Adopcion.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!adopcionActualizada) {
            return resp.status(404).json({ mensaje: "Adopción no encontrada" });
        }

        resp.status(200).json(adopcionActualizada);

    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// =======================================
//  ELIMINAR ADOPCIÓN
// =======================================
route.delete('/:id', async (req, resp) => {
    try {
        const adopcionEliminada = await Adopcion.findByIdAndDelete(req.params.id);

        if (!adopcionEliminada) {
            return resp.status(404).json({ mensaje: "Adopción no encontrada" });
        }

        resp.status(200).json({ mensaje: 'Adopción eliminada' });

    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// =======================================
//  LISTAR TODAS LAS ADOPCIONES
// =======================================
route.get('/', async (req, resp) => {
    try {
        const adopciones = await Adopcion.find()
            .populate('idAnimal')
            .populate('idCliente');

        resp.json(adopciones);

    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

module.exports = route;
