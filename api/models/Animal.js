const mongoose = require('mongoose');

const AnimalSchema = new mongoose.Schema(
    {
        idTipo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TipoAnimal',
            required: true
        },
        idRefugio: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Refugio',
            required: true
        },
        nombre: {
            type: String,
            required: true
        },
        edad: {
            type: Number,
            required: true
        },
        raza: {
            type: String,
            required: true
        },
        sexo: {
            type: String,
            enum: ['Macho', 'Hembra'],
            required: true
        },
        salud: {
            type: String,
            required: true
        }
    },
    {
    collection: "Animales"
  }
);

module.exports = mongoose.model('Animal', AnimalSchema);
