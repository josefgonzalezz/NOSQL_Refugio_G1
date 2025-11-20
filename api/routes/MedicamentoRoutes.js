const express = require('express');
const route = express.Router();

const Medicamento = require('../models/Medicamento');

// Crear un nuevo medicamento
route.post('/', async (req, resp) => {
    const {
        idAnimal,
        nombreMedicamento,
        dosis,
        fechaVencimiento
    } = req.body;

    const nuevoMedicamento = new Medicamento({
        idAnimal,
        nombreMedicamento,
        dosis,
        fechaVencimiento
    });

    try {
        const guardado = await nuevoMedicamento.save();
        resp.status(201).json(guardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// Actualizar medicamento
route.put('/:id', async (req, resp) => {
    try {
        const actualizado = await Medicamento.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!actualizado) {
            return resp.status(404).json({ mensaje: "Medicamento no encontrado" });
        }

        resp.status(200).json(actualizado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// Eliminar medicamento
route.delete('/:id', async (req, resp) => {
    try {
        const eliminado = await Medicamento.findByIdAndDelete(req.params.id);

        if (!eliminado) {
            return resp.status(404).json({ mensaje: "Medicamento no encontrado" });
        }

        resp.status(200).json({ mensaje: "Medicamento eliminado" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// Obtener todos los medicamentos
route.get('/', async (req, resp) => {
    try {
        const datos = await Medicamento.find();
        resp.json(datos);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

// Obtener un medicamento por ID
route.get('/:id', async (req, resp) => {
    try {
        const dato = await Medicamento.findById(req.params.id);

        if (!dato) {
            return resp.status(404).json({ mensaje: "Medicamento no encontrado" });
        }

        resp.json(dato);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

module.exports = route;
