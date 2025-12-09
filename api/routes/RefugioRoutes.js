const express = require('express');
const route = express.Router();

const Refugio = require('../models/Refugio');
const DireccionRefugio = require('../models/DireccionRefugio');

route.post('/', async (req, resp) => {
    try {
        const { nombre, descripcion, fechaFundacion, capacidad, correo, telefono, provincia, canton, distrito, detalles } = req.body;

        const nuevaDireccion = new DireccionRefugio({
            provincia,
            canton,
            distrito,
            detalles
        });
        const direccionGuardada = await nuevaDireccion.save();

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

        direccionGuardada.idRefugio = refugioGuardado._id;
        await direccionGuardada.save();

       
        const refugioConDireccion = await Refugio.findById(refugioGuardado._id).populate('direccion');
        resp.status(201).json(refugioConDireccion);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


route.get('/', async (req, resp) => {
    try {
        const refugios = await Refugio.find().populate('direccion');
        resp.json(refugios);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});


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


route.put('/:id', async (req, resp) => {
    try {
        const { nombre, descripcion, fechaFundacion, capacidad, correo, telefono, provincia, canton, distrito, detalles } = req.body;

        const refugio = await Refugio.findById(req.params.id);
        if (!refugio) return resp.status(404).json({ mensaje: "Refugio no encontrado" });


        refugio.nombre = nombre;
        refugio.descripcion = descripcion;
        refugio.fechaFundacion = fechaFundacion;
        refugio.capacidad = capacidad;
        refugio.correo = correo;
        refugio.telefono = telefono;
        await refugio.save();

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


route.delete('/:id', async (req, resp) => {
    try {
        const refugio = await Refugio.findById(req.params.id);
        if (!refugio) return resp.status(404).json({ mensaje: "Refugio no encontrado" });


        if (refugio.direccion) {
            await DireccionRefugio.findByIdAndDelete(refugio.direccion);
        }
        await Refugio.findByIdAndDelete(req.params.id);

        resp.status(200).json({ mensaje: "Refugio eliminado correctamente" });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});

module.exports = route;