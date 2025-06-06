const mongoose = require('mongoose');

const PacienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  fechaNacimiento: { type: Date, required: true },
  tipoSangre: { type: String, required: true },
  telefono: { type: String, required: true },
  domicilio: { type: String, required: true },
  correo: { type: String },
  contraseña: { type: String, required: true } // 🔐 nuevo campo
  
});

module.exports = mongoose.model('Paciente', PacienteSchema);
