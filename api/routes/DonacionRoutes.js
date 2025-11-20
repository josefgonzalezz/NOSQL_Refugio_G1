const express = require('express');
const route = express.Router();

const Donacion = require('../models/Donacion');


// Crear nueva donación
route.post('/', async (req, resp) => {
    const { idRefugio, idCliente, montoCantidad, fecha, descripcion } = req.body;

    const nuevaDonacion = new Donacion({
        idRefugio,
        idCliente,
        montoCantidad,
        fecha,
        descripcion
    });

    try {
        const donacionGuardada = await nuevaDonacion.save();
        resp.status(201).json(donacionGuardada);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


// Actualizar donación
route.put('/:id', async (req, resp) => {
    try {
        const donacionActualizada = await Donacion.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!donacionActualizada) {
            return resp.status(404).json({ mensaje: "Donación no encontrada" });
        }

        resp.status(200).json(donacionActualizada);

    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


// Eliminar donación
route.delete('/:id', async (req, resp) => {
    try {
        const donacionEliminada = await Donacion.findByIdAndDelete(req.params.id);

        if (!donacionEliminada) {
            return resp.status(404).json({ mensaje: "Donación no encontrada" });
        }

        resp.status(200).json({ mensaje: 'Donación eliminada' });

    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


// Obtener todas las donaciones
route.get('/', async (req, resp) => {
    try {
        const donaciones = await Donacion.find()
            .populate('idRefugio')
            .populate('idCliente');

        resp.json(donaciones);

    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

module.exports = route;
