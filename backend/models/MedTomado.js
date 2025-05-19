const mongoose = require('mongoose');

const MedTomadoSchema = new mongoose.Schema({
  pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  medicamento: { type: String, required: true },
  fechaHora: { type: Date, required: true }
});

module.exports = mongoose.model('MedTomado', MedTomadoSchema);
