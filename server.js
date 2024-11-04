const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require("bcrypt")
const helmet = require("helmet")
const xss = require("xss-clean")
const rateLimit = require("express-rate-limit")

const Tarea = require("./models/Tarea")
const Evaluacion = require("./models/Evaluacion")
const Usuario = require("./models/Usuario")

require('dotenv').config()
const connectionString = process.env.MONGO_URI
const authenticateUser = require("./middleware/authenticator");

const app = express();


const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.set("trust proxy", 1)
app.use(limiter)

app.use(cors());
app.use(express.json());
app.use(helmet())
app.use(xss())


mongoose.connect(connectionString).then(() => console.log("Conectado a DB..."))

port = process.env.PORT || 5000

app.post('/api/register', async (req, res) => {
  const { username, password, nombre, apellido, admin } = req.body
  
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password,salt)
  const tempUser = { username, password:hashedPassword, nombre, apellido, admin }

  const usuario = await Usuario.create({ ...tempUser })
  const token = usuario.createJWT()
  res.status(201).json({ usuario: { username: usuario.username }, admin: {admin: usuario.admin}, token })
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    throw new Error("Por favor ingrese los datos.")
  }

  const usuario = await Usuario.findOne({ username })

  if (!usuario) {
    throw new Error("Datos inválidos.")
  }

  const isPasswordCorrect = await usuario.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new Error("Contraseña incorrecta.")
  }

  const token = usuario.createJWT()
  res.status(200).json({ usuario: { username: usuario.username }, admin: {admin: usuario.admin}, token })
});

app.get('/api/tareas', async (req, res) => {
  const tareas = await Tarea.find().sort("createdAt");
  res.json(tareas);
});

app.post('/api/tareas', authenticateUser, async (req, res) => {
  const nuevaTarea = new Tarea(req.body);
  await nuevaTarea.save();
  res.status(201).json(nuevaTarea);
});

app.delete('/api/tareas/:id', authenticateUser, async (req, res) => {
  const { id } = req.params;
  try {
      const tareaEliminada = await Tarea.findByIdAndDelete(id);
      if (!tareaEliminada) {
          return res.status(404).json({ message: 'Tarea no encontrada' });
      }
      res.status(200).json({ message: 'Tarea eliminada con éxito' });
  } catch (error) {
      res.status(500).json({ message: 'Error al eliminar la tarea' });
  }
});


app.get('/api/evaluaciones', async (req, res) => {
  const evaluaciones = await Evaluacion.find().sort("createdAt");
  res.json(evaluaciones);
});

app.post('/api/evaluaciones', authenticateUser, async (req, res) => {
  const nuevaEvaluacion = new Evaluacion(req.body);
  await nuevaEvaluacion.save();
  res.status(201).json(nuevaEvaluacion);
});


app.listen(port, () => {
  console.log('Servidor en funcionamiento en puerto ' + port);
});
