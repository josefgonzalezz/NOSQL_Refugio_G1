const mongoose = require('mongoose');

const EventoSchema = new mongoose.Schema(
    {        
        idRefugio: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Refugio',
            required: true
        },
        fecha:{
            type: String,
            required: true
        },
        hora:{
            type: String,
            required: true
        },
        motivo:{
            type: String,
            required: true
        },
        comentario:{
            type: String,
            required: true
        }
    },
    {
    collection: "Eventos"
  }
);

module.exports = mongoose.model('Evento', EventoSchema);
