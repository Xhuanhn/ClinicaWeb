const mongoose = require('mongoose');

const SignosVitalesSchema = new mongoose.Schema({
  pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  presion: String,
  glucosa: String,
  respiracion: String,
  pulso: String,
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SignosVitales', SignosVitalesSchema);
