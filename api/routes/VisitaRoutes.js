const express = require('express');
const route = express.Router();

const Visita = require('../models/Visita');

// Crear visita
route.post('/', async (req, resp) => {
    const {
        idRefugio,
        idCliente,
        fecha,
        hora,
        motivo
    } = req.body;

    const nuevaVisita = new Visita({
        idRefugio,
        idCliente,
        fecha,
        hora,
        motivo
    });

    try {
        const guardado = await nuevaVisita.save();
        resp.status(201).json(guardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// Actualizar visita
route.put('/:id', async (req, resp) => {
    try {
        const actualizado = await Visita.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!actualizado) {
            return resp.status(404).json({ mensaje: "Visita no encontrada" });
        }

        resp.status(200).json(actualizado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// Eliminar visita
route.delete('/:id', async (req, resp) => {
    try {
        const eliminado = await Visita.findByIdAndDelete(req.params.id);

        if (!eliminado) {
            return resp.status(404).json({ mensaje: "Visita no encontrada" });
        }

        resp.status(200).json({ mensaje: "Visita eliminada" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// Obtener todas las visitas
route.get('/', async (req, resp) => {
    try {
        const datos = await Visita.find();
        resp.json(datos);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

// Obtener visita por ID
route.get('/:id', async (req, resp) => {
    try {
        const dato = await Visita.findById(req.params.id);

        if (!dato) {
            return resp.status(404).json({ mensaje: "Visita no encontrada" });
        }

        resp.json(dato);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

module.exports = route;
