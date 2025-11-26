const express = require('express');
const route = express.Router();

const Animal = require('../models/Animal');


route.post('/', async (req, resp) => {
    const { idTipo, idRefugio, nombre, edad, raza, sexo, salud } = req.body;

    const nuevoAnimal = new Animal({
        idTipo,
        idRefugio,
        nombre,
        edad,
        raza,
        sexo,
        salud
    });

    try {
        const animalGuardado = await nuevoAnimal.save();
        resp.status(201).json(animalGuardado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


// Actualizar animal
route.put('/:id', async (req, resp) => {
    try {
        const animalActualizado = await Animal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!animalActualizado) {
            return resp.status(404).json({ mensaje: "Animal no encontrado" });
        }

        resp.status(200).json(animalActualizado);
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


route.delete('/:id', async (req, resp) => {
    try {
        const animalEliminado = await Animal.findByIdAndDelete(req.params.id);

        if (!animalEliminado) {
            return resp.status(404).json({ mensaje: "Animal no encontrado" });
        }

        resp.status(200).json({ mensaje: 'Animal eliminado' });
    } catch (error) {
        resp.status(400).json({ mensaje: error.message });
    }
});


route.get('/', async (req, resp) => {
    try {
        const animales = await Animal.find()
            .populate('idTipo')
            .populate('idRefugio');

        resp.json(animales);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});


route.get('/:id', async (req, resp) => {
    try {
        const animal = await Animal.findById(req.params.id)
            .populate('idTipo')
            .populate('idRefugio');

        if (!animal) {
            return resp.status(404).json({ mensaje: "Animal no encontrado" });
        }

        resp.json(animal);
    } catch (error) {
        resp.status(500).json({ mensaje: error.message });
    }
});


module.exports = route;