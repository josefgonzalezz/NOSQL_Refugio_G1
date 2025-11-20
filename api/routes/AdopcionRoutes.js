const express = require('express');
const route = express.Router();

const Adopcion = require('../models/Adopcion');

// Crear nueva adopción
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


// Actualizar adopción
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


// Eliminar adopción
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


// Obtener todas las adopciones
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
