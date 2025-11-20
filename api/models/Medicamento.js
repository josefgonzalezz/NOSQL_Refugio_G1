const mongoose = require('mongoose');

const MedicamentoSchema = new mongoose.Schema(
    {
        idAnimal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Animal',
            required: true
        },
        nombreMedicamento: {
            type: String,
            required: true
        },
        dosis: {
            type: String,
            required: true
        },
        fechaVencimiento: {
            type: String,
            required: true
        }
    },
    { collection: 'Medicamentos' } 
);

module.exports = mongoose.model('Medicamento', MedicamentoSchema);
