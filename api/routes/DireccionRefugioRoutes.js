const express = require('express');
const route = express.Router();

const DireccionRefugio = require('../models/DireccionRefugio');

route.post('/', async (req, resp) => {
    const {
        idRefugio,
        provincia,
        canton,
        distrito,
        detalles
    } = req.body;

    const nuevaDireccion = new DireccionRefugio({
        idRefugio,
        provincia,
        canton,
        distrito,
        detalles
    });

    try {
        const guardado = await nuevaDireccion.save();
        resp.status(201).json(guardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

route.put('/:id', async (req, resp) => {
    try {
        const actualizado = await DireccionRefugio.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!actualizado) {
            return resp.status(404).json({ mensaje: "Dirección no encontrada" });
        }

        resp.status(200).json(actualizado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

route.delete('/:id', async (req, resp) => {
    try {
        const eliminado = await DireccionRefugio.findByIdAndDelete(req.params.id);

        if (!eliminado) {
            return resp.status(404).json({ mensaje: "Dirección no encontrada" });
        }

        resp.status(200).json({ mensaje: "Dirección eliminada" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

route.get('/', async (req, resp) => {
    try {
        const datos = await DireccionRefugio.find();
        resp.json(datos);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});


route.get('/:id', async (req, resp) => {
    try {
        const dato = await DireccionRefugio.findById(req.params.id);

        if (!dato) {
            return resp.status(404).json({ mensaje: "Dirección no encontrada" });
        }

        resp.json(dato);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

module.exports = route;
