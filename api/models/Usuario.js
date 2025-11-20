const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        identificacion: {
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
        },
        direccion: {
            type: String,
            required: true
        }
    },
    { collection: 'Usuarios' }
);

module.exports = mongoose.model('Usuario', UsuarioSchema);
