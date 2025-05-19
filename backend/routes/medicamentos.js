const express = require('express');
const router = express.Router();
const Medicamento = require('../models/Medicamento');
const Paciente = require('../models/Paciente');

// Guardar nuevo plan
router.post('/guardar', async (req, res) => {
  try {
    const nuevo = new Medicamento(req.body);
    await nuevo.save();
    res.json({ mensaje: 'Plan de medicación guardado correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al guardar plan de medicación', detalles: error.message });
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

router.post('/notificaciones', async (req, res) => {
  const { correo } = req.body;
  console.log('📩 Correo recibido:', correo);

  try {
    const paciente = await Paciente.findOne({ correo });
    if (!paciente) {
      console.log('❌ Paciente no encontrado');
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    const hoy = new Date();

    // Medicamentos activos
    const medicamentosActivos = await Medicamento.find({
      pacienteId: paciente._id,
      fechaFinalizado: { $gte: hoy }
    });

    // Notificaciones de medicamentos
    const notificacionesMedicamentos = medicamentosActivos.map(med => ({
      mensaje: `Recordatorio: tomar ${med.medicamentos} (${med.instrucciones})`
    }));

    // Citas futuras
    const Cita = require('../models/Cita');
    const citasFuturas = await Cita.find({
      pacienteId: paciente._id,
      fecha: { $gte: hoy }
    });

    const notificacionesCitas = citasFuturas.map(cita => ({
      mensaje: `Cita médica con ${cita.doctor} el ${new Date(cita.fecha).toLocaleDateString()} a las ${cita.hora} (${cita.tipo})`
    }));

    // Unir ambas listas
    const notificaciones = [...notificacionesMedicamentos, ...notificacionesCitas];

    res.json(notificaciones);
  } catch (error) {
    console.error('❌ Error en notificaciones:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
});

router.post('/por-paciente', async (req, res) => {
  const { correo } = req.body;

  try {
    const paciente = await require('../models/Paciente').findOne({ correo });
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });

    const hoy = new Date();
    const medicamentos = await Medicamento.find({
      pacienteId: paciente._id,
      fechaFinalizado: { $gte: hoy }
    });

    res.json(medicamentos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener medicamentos' });
  }
});



module.exports = router;
