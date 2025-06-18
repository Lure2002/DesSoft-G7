const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.includes('http://localhost')) {
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

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });
    const usuario = await prisma.usuario.findUnique({ 
      where: { email },
      include: { mascotas: true } 
    });
    console.log('Usuario encontrado:', usuario);
    if (!usuario) {
      return response(res, 404, 'Not Found', { error: 'Usuario no encontrado' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.hash_contrasenia);
    if (!passwordValido) {
      return response(res, 401, 'Unauthorized', { error: 'Contraseña incorrecta' });
    }
    console.log('Contraseña válida para el usuario:', usuario.email);

    return response(res, 200, 'OK', {
      id: usuario.id, nombre: usuario.nombre, email: usuario.email, mascotas: usuario.mascotas
    });
  } catch (error) {
    console.error('Error en el login:', error);
    return response(res, 500, 'Internal Server Error', { error: error.message });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const usuario = await prisma.usuario.findUnique({ 
      where: { email }
    });
    if (usuario) {
      return response(res, 401, 'Existing User', { error: 'Usuario existente' });
    }
    const passwordHasheado = await bcrypt.hash(password, 10);
    const nuevo = await prisma.usuario.create({
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

app.get('/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await prisma.usuario.findUnique({
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

app.delete('/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await prisma.usuario.delete({
      where: { id: Number(id) }
    });
    return response(res, 200, 'OK', usuario);
  } catch (error) {
    return response(res, 500, 'Internal Server Error', { error: error.message });
  }
});

app.get('/usuario/:id/mascotas', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await prisma.usuario.findUnique({
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

app.get('/usuario/:id/mascota/:idMascota', async (req, res) => {
  try {
    const { id, idMascota } = req.params;
    const mascota = await prisma.mascota.findUnique({
      where: { id: Number(idMascota), id_user: Number(id) }
    });

    if (!usuario) {
      return response(res, 404, 'Not Found', { error: 'Mascota no encontrada' });
    }

    return response(res, 200, 'OK', mascota);
  } catch (error) {
    return response(res, 500, 'Internal Server Error', { error: error.message });
  }
});

app.post('/mascota', async (req, res) => {
  try {
    const {
      nombre,
      id_raza,
      id_especie,
      id_user,
      pulsaciones,
      temperatura,
      latitud,
      longitud,
      sexo
    } = req.body;

    const nuevaMascota = await prisma.mascota.create({
      data: {
        nombre,
        pulsaciones,
        temperatura,
        latitud,
        longitud,
        sexo,
        ...(id_raza && {
          raza: { connect: { id: id_raza } }
        }),
        ...(id_especie && {
          especie: { connect: { id: id_especie } }
        }),
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
    const mascota = await prisma.mascota.delete({
      where: { id: Number(id) }
    });
    return response(res, 200, 'OK', mascota);
  } catch (error) {
    return response(res, 500, 'Internal Server Error', { error: error.message });
  }
});

app.get('/razas/:idEspecie', async (req, res) => {
  try {
    const { idEspecie } = req.params;
    const razas = prisma.raza.findMany({
      where: { id_especie: Number(idEspecie) }
    });
    return response(res, 200, 'OK', razas);
  } catch (error) {
    return response(res, 500, 'Internal Server Error', { error: error.message });
  }
});

app.get('/especies', async (req, res) => {
  try {
    const especies = await prisma.especie.findMany();
    return response(res, 200, 'OK', especies);
  } catch (error) {
    return response(res, 500, 'Internal Server Error', { error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
