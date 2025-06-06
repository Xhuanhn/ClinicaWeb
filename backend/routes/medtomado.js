const express = require('express');
const router = express.Router();
const MedTomado = require('../models/MedTomado');

router.post('/registrar', async (req, res) => {
  try {
    const { pacienteId, medicamento } = req.body;
    if (!pacienteId || !medicamento) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const nuevo = new MedTomado({
      pacienteId,
      medicamento,
      fechaHora: new Date()
    });

    await nuevo.save();
    console.log('✅ MedTomado guardado:', nuevo);
    res.json({ mensaje: 'Medicación registrada con éxito' });
  } catch (error) {
    console.error('❌ Error al registrar:', error);
    res.status(500).json({ error: 'Error al registrar toma de medicamento' });
  }
});

router.post('/por-paciente', async (req, res) => {
  const { correo } = req.body;
  const Paciente = require('../models/Paciente');

  try {
    const paciente = await Paciente.findOne({ correo });
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });

    const historial = await MedTomado.find({ pacienteId: paciente._id }).sort({ fechaHora: -1 });

    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial de medicamentos' });
  }
});

router.post('/reporte-completo', async (req, res) => {
  const { pacienteId, fechaInicio, fechaFin } = req.body;
  const SignosVitales = require('../models/SignosVitales');

  try {
    const medicamentos = await MedTomado.find({
      pacienteId,
      fechaHora: { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) }
    });

    const signos = await SignosVitales.find({
      pacienteId,
      fecha: { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) }
    });

    res.json({ medicamentos, signos });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos para el reporte' });
  }
});



module.exports = router;
