const mongoose = require('mongoose');

const PersonalSchema = new mongoose.Schema(
    {
        idRefugio: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Refugio',
            required: true
        },
        nombre: {
            type: String,
            required: true
        },
        puesto: {
            type: String,
            required: true
        },
        telefono: {
            type: String,
            required: true
        },
        correo: {
            type: String,
            required: true
        }
    },
    { collection: 'Personal' }
);

module.exports = mongoose.model('Personal', PersonalSchema);
