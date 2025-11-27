const express = require('express');
const route = express.Router();

const Refugio = require('../models/Refugio');
const DireccionRefugio = require('../models/DireccionRefugio');

// Crear refugio con dirección
route.post('/', async (req, resp) => {
    try {
        const { nombre, descripcion, fechaFundacion, capacidad, correo, telefono, provincia, canton, distrito, detalles } = req.body;

        // Guardar dirección primero
        const nuevaDireccion = new DireccionRefugio({
            provincia,
            canton,
            distrito,
            detalles
        });
        const direccionGuardada = await nuevaDireccion.save();

        // Guardar refugio con referencia a la dirección
        const nuevoRefugio = new Refugio({
            nombre,
            descripcion,
            fechaFundacion,
            capacidad,
            correo,
            telefono,
            direccion: direccionGuardada._id
        });
        const refugioGuardado = await nuevoRefugio.save();

        // Actualizar idRefugio en la dirección
        direccionGuardada.idRefugio = refugioGuardado._id;
        await direccionGuardada.save();

        // Devolver refugio con dirección completa
        const refugioConDireccion = await Refugio.findById(refugioGuardado._id).populate('direccion');
        resp.status(201).json(refugioConDireccion);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// Obtener todos los refugios con dirección
route.get('/', async (req, resp) => {
    try {
        const refugios = await Refugio.find().populate('direccion');
        resp.json(refugios);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

// Obtener un refugio específico con dirección
route.get('/:id', async (req, resp) => {
    try {
        const refugio = await Refugio.findById(req.params.id).populate('direccion');
        
        if (!refugio) {
            return resp.status(404).json({ mensaje: "Refugio no encontrado" });
        }

        resp.json(refugio);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});

// Editar refugio y su dirección
route.put('/:id', async (req, resp) => {
    try {
        const { nombre, descripcion, fechaFundacion, capacidad, correo, telefono, provincia, canton, distrito, detalles } = req.body;

        const refugio = await Refugio.findById(req.params.id);
        if (!refugio) return resp.status(404).json({ mensaje: "Refugio no encontrado" });

        // Actualizar campos de refugio
        refugio.nombre = nombre;
        refugio.descripcion = descripcion;
        refugio.fechaFundacion = fechaFundacion;
        refugio.capacidad = capacidad;
        refugio.correo = correo;
        refugio.telefono = telefono;
        await refugio.save();

        // Actualizar dirección asociada
        if (refugio.direccion) {
            await DireccionRefugio.findByIdAndUpdate(refugio.direccion, { 
                provincia, 
                canton, 
                distrito, 
                detalles 
            });
        }

        const actualizado = await Refugio.findById(refugio._id).populate('direccion');
        resp.status(200).json(actualizado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

// Eliminar refugio y su dirección
route.delete('/:id', async (req, resp) => {
    try {
        const refugio = await Refugio.findById(req.params.id);
        if (!refugio) return resp.status(404).json({ mensaje: "Refugio no encontrado" });

        // Eliminar la dirección asociada
        if (refugio.direccion) {
            await DireccionRefugio.findByIdAndDelete(refugio.direccion);
        }

        // Eliminar el refugio
        await Refugio.findByIdAndDelete(req.params.id);

        resp.status(200).json({ mensaje: "Refugio eliminado correctamente" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;