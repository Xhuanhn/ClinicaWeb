const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const Paciente = require('../models/Paciente');

router.post('/register', async (req, res) => {
    const { nombre, correo, contraseña } = req.body;
    try {
      const hashed = await bcrypt.hash(contraseña, 10);
      const nuevoUsuario = new Usuario({ nombre, correo, contraseña: hashed });
      await nuevoUsuario.save();
      res.json({ mensaje: 'Usuario registrado' });
    } catch (error) {
      res.status(400).json({ error: 'Error al registrar usuario' });
    }
  });
  

router.post('/login', async (req, res) => {
  const { nombre, contraseña } = req.body;
  try {
    const usuario = await Usuario.findOne({ nombre });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    const coincide = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!coincide) return res.status(401).json({ error: 'Contraseña incorrecta' });
res.json({ mensaje: 'Inicio de sesión exitoso', rol: usuario.rol, nombre: usuario.nombre });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// POST /api/auth/login-paciente
router.post('/login-paciente', async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    console.log('Correo recibido:', correo);
    const paciente = await Paciente.findOne({ correo });

    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    if (paciente.contraseña !== contraseña) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

  res.json({ nombre: paciente.nombre, correo: paciente.correo });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, 'nombre correo'); // Puedes filtrar por rol si usas roles
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});


module.exports = router;
