const mongoose = require('mongoose');

const TipoAnimalSchema = new mongoose.Schema(
    {
        tipo: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        collection: "tiposAnimales"
    }
);

module.exports = mongoose.model('TipoAnimal', TipoAnimalSchema);
