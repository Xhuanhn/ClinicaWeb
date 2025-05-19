const express = require('express');
const router = express.Router();
const Cita = require('../models/Cita');
const Paciente = require('../models/Paciente');

// Crear cita
router.post('/crear', async (req, res) => {
  try {
    const nuevaCita = new Cita(req.body);
    await nuevaCita.save();
    res.json({ mensaje: 'Cita registrada correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al registrar cita', detalles: error.message });
  }
});

// Listar pacientes
router.get('/pacientes', async (req, res) => {
  try {
    const pacientes = await Paciente.find({}, '_id nombre');
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
});

module.exports = router;
