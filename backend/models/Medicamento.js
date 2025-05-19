const mongoose = require('mongoose');

const MedicamentoSchema = new mongoose.Schema({
  pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  medicamentos: { type: String, required: true },
  instrucciones: { type: String, required: true },
  fechaFinalizado: { type: Date, required: true } // ✅ nuevo campo requerido
});

module.exports = mongoose.model('Medicamento', MedicamentoSchema);
