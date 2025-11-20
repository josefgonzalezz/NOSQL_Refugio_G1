const mongoose = require('mongoose');

const RefugioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        descripcion: {
            type: String,
            required: true
        },
        fechaFundacion: {
            type: String,
            required: true
        },
        capacidad: {
            type: Number,
            required: true
        },
        correo: {
            type: String,
            required: true
        },
        telefono: {
            type: String,
            required: true
        }
    },
    { collection: 'Refugios' }
);

module.exports = mongoose.model('Refugio', RefugioSchema);
