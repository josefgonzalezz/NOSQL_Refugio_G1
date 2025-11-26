const express = require('express');
const route = express.Router();

const Personal = require('../models/Personal');


route.post('/', async (req, resp) => {
    const {
        idRefugio,
        nombre,
        puesto,
        telefono,
        correo
    } = req.body;

    const nuevoPersonal = new Personal({
        idRefugio,
        nombre,
        puesto,
        telefono,
        correo
    });

    try {
        const guardado = await nuevoPersonal.save();
        resp.status(201).json(guardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


route.put('/:id', async (req, resp) => {
    try {
        const actualizado = await Personal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!actualizado) {
            return resp.status(404).json({ mensaje: "Personal no encontrado" });
        }

        resp.status(200).json(actualizado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


route.delete('/:id', async (req, resp) => {
    try {
        const eliminado = await Personal.findByIdAndDelete(req.params.id);

        if (!eliminado) {
            return resp.status(404).json({ mensaje: "Personal no encontrado" });
        }

        resp.status(200).json({ mensaje: "Personal eliminado" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


route.get('/', async (req, resp) => {
    try {
        const datos = await Personal.find();
        resp.json(datos);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

route.get('/:id', async (req, resp) => {
    try {
        const dato = await Personal.findById(req.params.id);

        if (!dato) {
            return resp.status(404).json({ mensaje: "Personal no encontrado" });
        }

        resp.json(dato);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

module.exports = route;
