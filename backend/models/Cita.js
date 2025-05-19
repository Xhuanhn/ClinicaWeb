const mongoose = require('mongoose');

const CitaSchema = new mongoose.Schema({
  pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  fecha: { type: Date, required: true },
  hora: { type: String, required: true },
  tipo: { type: String, required: true },
  doctor: { type: String, required: true }
});

module.exports = mongoose.model('Cita', CitaSchema);
