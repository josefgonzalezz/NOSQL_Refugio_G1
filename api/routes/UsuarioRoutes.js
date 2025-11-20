const express = require('express');
const route = express.Router();

const Usuario = require('../models/Usuario');

// Crear usuario
route.post('/', async (req, resp) => {
    const {
        nombre,
        identificacion,
        telefono,
        correo,
        direccion
    } = req.body;

    const nuevoUsuario = new Usuario({
        nombre,
        identificacion,
        telefono,
        correo,
        direccion
    });

    try {
        const guardado = await nuevoUsuario.save();
        resp.status(201).json(guardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// Actualizar usuario
route.put('/:id', async (req, resp) => {
    try {
        const actualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!actualizado) {
            return resp.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        resp.status(200).json(actualizado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// Eliminar usuario
route.delete('/:id', async (req, resp) => {
    try {
        const eliminado = await Usuario.findByIdAndDelete(req.params.id);

        if (!eliminado) {
            return resp.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        resp.status(200).json({ mensaje: "Usuario eliminado" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// Obtener todos
route.get('/', async (req, resp) => {
    try {
        const datos = await Usuario.find();
        resp.json(datos);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

// Obtener uno por ID
route.get('/:id', async (req, resp) => {
    try {
        const dato = await Usuario.findById(req.params.id);

        if (!dato) {
            return resp.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        resp.json(dato);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

module.exports = route;
