const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const pacientesRoutes = require('./routes/pacientes');
const medicamentosRoutes = require('./routes/medicamentos');
const citasRoutes = require('./routes/citas');
const medtomadoRoutes = require('./routes/medtomado');



const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/medicamentos', medicamentosRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/medtomado', medtomadoRoutes);




mongoose.connect('mongodb+srv://admin2:admin234@ventaautos.xud7o.mongodb.net/ClinicaDB?retryWrites=true&w=majority&appName=VentaAutos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('🟢 Conectado a MongoDB Atlas'))
.catch(err => console.error('🔴 Error al conectar a MongoDB:', err));

app.listen(5000, () => console.log('Servidor corriendo en puerto 5000'));
