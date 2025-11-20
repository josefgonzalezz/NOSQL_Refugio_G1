const mongoose = require("mongoose");

const FormularioSchema = new mongoose.Schema(
  {
    idRefugio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Refugio",
      required: true
    },
    idCliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true
    },
    fecha: {
      type: String,
      required: true
    },
    calificacion: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comentario: {
      type: String,
      required: true
    }
  },
  {
    collection: "Formularios"
  }
);

module.exports = mongoose.model("Formulario", FormularioSchema);
