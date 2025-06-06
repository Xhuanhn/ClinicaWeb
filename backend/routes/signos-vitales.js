const express = require('express');
const router = express.Router();
const SignosVitales = require('../models/SignosVitales');
const Paciente = require('../models/Paciente');

// 👉 Ruta para guardar signos vitales desde la app
router.post('/registrar', async (req, res) => {
  try {
    const nuevo = new SignosVitales(req.body);
    await nuevo.save();
    res.json({ mensaje: 'Signos vitales guardados correctamente' });
  } catch (error) {
    console.error('❌ Error al guardar signos vitales:', error);
    res.status(500).json({ error: 'Error al guardar signos vitales' });
  }
});

// 👉 Ruta para obtener signos vitales por paciente
router.post('/por-paciente', async (req, res) => {
  const { correo } = req.body;

  try {
    const paciente = await Paciente.findOne({ correo });
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });

    const signos = await SignosVitales.find({ pacienteId: paciente._id }).sort({ fecha: -1 });
    res.json(signos);
  } catch (error) {
    console.error('❌ Error al obtener signos vitales:', error);
    res.status(500).json({ error: 'Error al obtener signos vitales' });
  }
});



module.exports = router;
