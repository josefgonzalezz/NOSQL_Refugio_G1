const express = require('express');
const route = express.Router();

const Formulario = require('../models/Formulario');

route.post('/', async (req, resp) => {
    const { idRefugio, idCliente, fecha, calificacion, comentario } = req.body;

    const nuevoFormulario = new Formulario({
        idRefugio,
        idCliente,
        fecha,
        calificacion,
        comentario
    });

    try {
        const guardado = await nuevoFormulario.save();
        resp.status(201).json(guardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

route.put('/:id', async (req, resp) => {
    try {
        const actualizado = await Formulario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!actualizado) {
            return resp.status(404).json({ mensaje: "Formulario no encontrado" });
        }

        resp.status(200).json(actualizado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


route.delete('/:id', async (req, resp) => {
    try {
        const eliminado = await Formulario.findByIdAndDelete(req.params.id);

        if (!eliminado) {
            return resp.status(404).json({ mensaje: "Formulario no encontrado" });
        }

        resp.status(200).json({ mensaje: "Formulario eliminado" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


route.get('/', async (req, resp) => {
    try {
        const datos = await Formulario.find();
        resp.json(datos);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

route.get('/:id', async (req, resp) => {
    try {
        const formulario = await Formulario.findById(req.params.id);

        if (!formulario) {
            return resp.status(404).json({ mensaje: "Formulario no encontrado" });
        }

        resp.json(formulario);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

module.exports = route;
