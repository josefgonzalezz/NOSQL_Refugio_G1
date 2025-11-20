const mongoose = require('mongoose');

const DonacionSchema = new mongoose.Schema(
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
        montoCantidad: {
            type: Number,
            required: true
        },
        fecha: {
            type: String,
            required: true
        },
        descripcion: {
            type: String,
            required: true
        }
    },
    {
    collection: "Donaciones"
  }
);

module.exports = mongoose.model('Donacion', DonacionSchema);
