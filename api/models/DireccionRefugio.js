const mongoose = require('mongoose');

const DireccionRefugioSchema = new mongoose.Schema(
    {
        idRefugio: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Refugio',
            required: false  
        },
        provincia: {
            type: String,
            required: true
        },
        canton: {
            type: String,
            required: true
        },
        distrito: {
            type: String,
            required: true
        },
        detalles: {
            type: String,
            required: false
        }
    },
    { collection: 'direccionesRefugio' }
);

module.exports = mongoose.model('DireccionRefugio', DireccionRefugioSchema);