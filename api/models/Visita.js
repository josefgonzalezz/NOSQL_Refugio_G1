const mongoose = require('mongoose');

const VisitaSchema = new mongoose.Schema(
    {
        idRefugio: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Refugio',
            required: true
        },
        idCliente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true
        },
        fecha: {
            type: String,
            required: true
        },
        hora: {
            type: String,
            required: true
        },
        motivo: {
            type: String,
            required: true
        }
    },
    { collection: 'Visitas' }
);

module.exports = mongoose.model('Visita', VisitaSchema);
