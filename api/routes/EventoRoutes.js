const express = require('express');
const route = express.Router();

const Evento = require('../models/Evento');

// Crear nuevo evento
route.post('/', async(req, resp) =>{
    const { idRefugio, fecha, hora, motivo, comentario } = req.body;

    const nuevoEvento = new Evento({
        idRefugio,
        fecha,
        hora,
        motivo,
        comentario
    });

    try {
        const eventoGuardado = await nuevoEvento.save();
        resp.status(201).json(eventoGuardado);
    } catch(error){
        resp.status(400).json({mensaje: error.message});
    }
});

// Update PUT
route.put('/:id', async(req, resp) =>{
    try {
        const eventoActualizado = await Evento.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!eventoActualizado){
            return resp.status(404).json({mensaje: "Evento no encontrado"});
        }

        resp.status(200).json(eventoActualizado);

    } catch(error){
        resp.status(400).json({mensaje: error.message});
    }
});

// Delete
route.delete('/:id', async(req, resp) =>{
    try {
        const eventoEliminado = await Evento.findByIdAndDelete(req.params.id);

        if (!eventoEliminado){
            return resp.status(404).json({mensaje: "Evento no encontrado"});
        }

        resp.status(200).json({mensaje : 'Evento eliminado'});
    } catch(error){
        resp.status(400).json({mensaje: error.message});
    }
});

// Obtener todos
route.get('/', async(req, resp) =>{
    try {
        const eventos = await Evento.find();
        resp.json(eventos);
    } catch(error){
        resp.status(500).json({mensaje: error.message});
    }
});

module.exports = route;
