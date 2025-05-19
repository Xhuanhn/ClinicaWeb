// backend/routes/pacientes.js
const express = require('express');
const router = express.Router();
const Paciente = require('../models/Paciente');
const crypto = require('crypto');

function generarContraseña() {
  return crypto.randomBytes(3).toString('hex'); // 6 caracteres hexadecimales
}

router.post('/registrar', async (req, res) => {
  try {
    const datosPaciente = req.body;
    datosPaciente.contraseña = generarContraseña(); // genera contraseña antes de guardar

    const nuevoPaciente = new Paciente(datosPaciente);
    await nuevoPaciente.save();
    res.json({ mensaje: 'Paciente registrado correctamente', contraseña: datosPaciente.contraseña });
  } catch (error) {
    res.status(400).json({ error: 'Error al registrar paciente', detalles: error.message });
  }
});

router.post('/id', async (req, res) => {
  const { correo } = req.body;
  const paciente = await Paciente.findOne({ correo });
  if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
  res.json({ pacienteId: paciente._id });
});

router.get('/', async (req, res) => {
  try {
    const pacientes = await Paciente.find();
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
});


module.exports = router;
