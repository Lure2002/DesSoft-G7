const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith('http://localhost')) {
      return callback(null, true);
    }
    return callback(new Error('No autorizado por CORS'));
  }
}));

// Función para formato de respuesta estándar
const response = (res, statusCode, reasonPhrase, body) => {
  return res.status(statusCode).json({
    statusCode,
    reasonPhrase,
    body
  });
};

app.post('/usuarios', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const passwordHasheado = await bcrypt.hash(password, 10);
    const nuevo = await prisma.usuarios.create({
      data: {
        nombre,
        email,
        hash_contrasenia: passwordHasheado
      }
    });
    return response(res, 201, 'Created', {
      id: nuevo.id, nombre: nuevo.nombre, email: nuevo.email
    });
  } catch (error) {
    return response(res, 500, 'Internal Server Error', { error: error.message });
  }
});

app.post('/usuarios/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await prisma.usuarios.findUnique({ 
      where: { email },
      include: { mascotas: true } 
    });

    if (!usuario) {
      return response(res, 404, 'Not Found', { error: 'Usuario no encontrado' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.hash_contrasenia);
    if (!passwordValido) {
      return response(res, 401, 'Unauthorized', { error: 'Contraseña incorrecta' });
    }

    return response(res, 200, 'OK', {
      id: usuario.id, nombre: usuario.nombre, email: usuario.email, mascotas: usuario.mascotas
    });
  } catch (error) {
    return response(res, 500, 'Internal Server Error', { error: error.message });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await prisma.usuarios.findMany();
    return response(res, 200, 'OK', usuarios);
  } catch (error) {
    return response(res, 500, 'Internal Server Error', { error: error.message });
  }
});

app.get('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await prisma.usuarios.findUnique({
      where: { id: Number(id) }
    });

    if (!usuario) {
      return response(res, 404, 'Not Found', { error: 'Usuario no encontrado' });
    }

    return response(res, 200, 'OK', usuario);
  } catch (error) {
    return response(res, 500, 'Internal Server Error', { error: error.message });
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await prisma.usuarios.delete({
      where: { id: Number(id) }
    });
    return response(res, 200, 'OK', usuario);
  } catch (error) {
    return response(res, 500, 'Internal Server Error', { error: error.message });
  }
});

app.get('/usuarios/:id/mascotas', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await prisma.usuarios.findUnique({
      where: { id: Number(id) },
      include: { mascotas: true }
    });

    if (!usuario) {
      return response(res, 404, 'Not Found', { error: 'Usuario no encontrado' });
    }

    return response(res, 200, 'OK', usuario.mascotas);
  } catch (error) {
    return response(res, 500, 'Internal Server Error', { error: error.message });
  }
});

app.post('/mascotas', async (req, res) => {
  try {
    const { nombre, id_raza, id_especie, id_user, pulsaciones, estado_ansiedad, latitud, longitud } = req.body;
    const nuevaMascota = await prisma.mascotas.create({
      data: {
        nombre,
        raza: {
          connect: { id: id_raza }
        },
        especie: {
          connect: { id: id_especie }
        },
        pulsaciones,
        estado_ansiedad,
        latitud,
        longitud,
        usuario: {
          connect: { id: id_user }
        }
      }
    });
    
    return response(res, 201, 'Created', nuevaMascota);
  } catch (error) {
    return response(res, 500, 'Internal Server Error', { error: error.message });
  }
});

app.delete('/mascotas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const mascota = await prisma.mascotas.delete({
      where: { id: Number(id) }
    });
    return response(res, 200, 'OK', mascota);
  } catch (error) {
    return response(res, 500, 'Internal Server Error', { error: error.message });
  }
});

app.delete('/usuarios/:id/mascotas', async (req, res) => {
  try {
    const { id } = req.params;
    const mascotas = await prisma.mascotas.deleteMany({
      where: { id_user: Number(id) }
    });
    return response(res, 200, 'OK', mascotas);
  } catch (error) {
    return response(res, 500, 'Internal Server Error', { error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
