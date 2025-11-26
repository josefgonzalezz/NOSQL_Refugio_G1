const express = require('express');
const route = express.Router();

const TipoAnimal = require('../models/TipoAnimal');


route.post('/', async (req, resp) => {
    const { tipo } = req.body;

    const nuevoTipo = new TipoAnimal({ tipo });

    try {
        const tipoGuardado = await nuevoTipo.save();
        resp.status(201).json(tipoGuardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


route.put('/:id', async (req, resp) => {
    try {
        const tipoActualizado = await TipoAnimal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!tipoActualizado) {
            return resp.status(404).json({ mensaje: "Tipo de animal no encontrado" });
        }

        resp.status(200).json(tipoActualizado);

    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


route.delete('/:id', async (req, resp) => {
    try {
        const tipoEliminado = await TipoAnimal.findByIdAndDelete(req.params.id);

        if (!tipoEliminado) {
            return resp.status(404).json({ mensaje: "Tipo de animal no encontrado" });
        }

        resp.status(200).json({ mensaje: 'Tipo de animal eliminado' });

    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


route.get('/', async (req, resp) => {
    try {
        const tipos = await TipoAnimal.find();
        resp.json(tipos);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

module.exports = route;
