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

// POST /api/citas/solicitar
router.post('/solicitar', async (req, res) => {
  try {
    const { correo, doctor, fecha, hora, motivo } = req.body;
    const paciente = await require('../models/Paciente').findOne({ correo });
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });

    await require('../models/Cita').create({
      pacienteId: paciente._id,
      doctor,
      fecha,
      hora,
      tipo: 'solicitada',
      motivo // puedes guardar el motivo si extiendes el modelo
    });

    res.json({ mensaje: 'Cita solicitada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al solicitar cita' });
  }
});

router.post('/solicitadas', async (req, res) => {
  const { doctor } = req.body;
  try {
    const citas = await Cita.find({ tipo: 'solicitada', doctor }).populate('pacienteId', 'nombre');
    res.json(citas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener citas solicitadas' });
  }
});

router.post('/por-paciente', async (req, res) => {
  try {
    const { correo } = req.body;
    const Paciente = require('../models/Paciente');
    const paciente = await Paciente.findOne({ correo });

    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    const citas = await require('../models/Cita').find({
      pacienteId: paciente._id,
      fecha: { $gte: new Date() } // solo futuras
    });

    res.json(citas);
  } catch (error) {
    console.error('❌ Error al obtener citas del paciente:', error);
    res.status(500).json({ error: 'Error al obtener citas' });
  }
});




module.exports = router;
