const mongoose = require('mongoose');

const AdopcionSchema = new mongoose.Schema(
    {        
        idAnimal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Animal',
            required: true
        },
        idCliente: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true
        },
        fechaAdopcion: {
            type: String,
            required: true
        },
        estado: {
            type: String,
            enum: ['Completada', 'Pendiente', 'Cancelada'],
            required: true,
            default: 'Pendiente'
        },
        observaciones: {
            type: String,
            required: false
        }
    },
    {
    collection: "Adopciones"
  }
);

module.exports = mongoose.model('Adopcion', AdopcionSchema);
