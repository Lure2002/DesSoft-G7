require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const multer = require('multer');

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

const upload = multer({ storage: multer.memoryStorage() });
// registro de usuario
app.post('/usuarios', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validaciones básicas
    if (!nombre || !email || !password) {
      return response(res, 400, 'Bad Request', { error: 'Faltan campos obligatorios' });
    }

    // Verificar si el email ya está registrado
    const existeUsuario = await prisma.usuarios.findUnique({
      where: { email }
    });

    if (existeUsuario) {
      return response(res, 400, 'Bad Request', { error: 'El email ya está en uso' });
    }

    // Hashear contraseña
    const passwordHasheado = await bcrypt.hash(password, 10);

    // Crear usuario
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
// Login
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
// Devuelve todos los ususarios
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
// registro de mascotas por id de ususario
app.post('/mascotas', async (req, res) => {
  try {
    const { nombre, sexo, id_raza, id_especie, id_user, pulsaciones, estado_ansiedad, latitud, longitud } = req.body;

    // Validar campos obligatorios
    if (!nombre || !sexo || !id_raza || !id_especie || !id_user) {
      return response(res, 400, 'Bad Request', { error: 'Faltan campos obligatorios' });
    }

    // Verificar que el usuario exista
    const usuario = await prisma.usuarios.findUnique({
      where: { id: id_user }
    });

    if (!usuario) {
      return response(res, 404, 'Not Found', { error: 'Usuario no encontrado' });
    }

    // Crear mascota
    const nuevaMascota = await prisma.mascotas.create({
      data: {
        nombre,
        sexo,
        id_raza,
        id_especie,
        pulsaciones,
        estado_ansiedad,
        latitud,
        longitud,
        id_user
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
// Devuelve las especies: Perro o Gato
app.get('/especies', async (req, res) => {
  try {
    const especies = await prisma.especies.findMany();
    return response(res, 200, 'OK', especies);
  } catch (error) {
    return response(res, 500, 'Internal Server Error', { error: error.message });
  }
});

app.get('/razas', async (req, res) => {
  try {
    const razas = await prisma.razas.findMany({
      include: {
        especie: true
      }
    });
    return response(res, 200, 'OK', razas);
  } catch (error) {
    return response(res, 500, 'Internal Server Error', { error: error.message });
  }
});
// Devuelve todas las razas por especie
app.get('/razas/especie/:id_especie', async (req, res) => {
  try {
    const { id_especie } = req.params;

    const razas = await prisma.razas.findMany({
      where: {
        id_especie: Number(id_especie)
      },
      include: {
        especie: true
      }
    });

    if (!razas.length) {
      return response(res, 404, 'Not Found', { error: 'No hay razas para esta especie' });
    }

    return response(res, 200, 'OK', razas);
  } catch (error) {
    return response(res, 500, 'Internal Server Error', { error: error.message });
  }
});
// Datos del Prototipo
app.post('/datos', async (req, res) => {
  const { temperatura, bpm, lat, lng, mascotaId } = req.body;

  // Validación básica
  if (!mascotaId || (!temperatura && !bpm)) {
    return res.status(400).json({
      status: 'ERROR',
      mensaje: 'Faltan datos: mascotaId y al menos un valor (temperatura o bpm)'
    });
  }

  try {
    // Buscar raza de la mascota
    const mascota = await prisma.mascota.findUnique({
      where: { id: Number(mascotaId) },
      include: {
        raza: true
      }
    });

    if (!mascota) {
      return res.status(404).json({
        status: 'ERROR',
        mensaje: 'Mascota no encontrada'
      });
    }

    const {
      temperaturaNormalMin,
      temperaturaNormalMax,
      pulsacionesNormalesMin,
      pulsacionesNormalesMax
    } = mascota.raza;

    const alertas = [];

    // Alertas de temperatura
    if (temperatura) {
      if (temperatura > temperaturaNormalMax) {
        alertas.push(`Temperatura más alta que lo normal (${temperatura}°C)`);
      } else if (temperatura < temperaturaNormalMin) {
        alertas.push(`Temperatura más baja que lo normal (${temperatura}°C)`);
      }
    }

    // Alertas de pulsaciones
    if (bpm) {
      if (bpm > pulsacionesNormalesMax) {
        alertas.push(`Pulsaciones más altas que lo normal (${bpm} ppm)`);
      } else if (bpm < pulsacionesNormalesMin) {
        alertas.push(`Pulsaciones más bajas que lo normal (${bpm} ppm)`);
      }
    }

    console.log('✔ Datos analizados');

    // Responder con alertas
    res.status(200).json({
      status: 'OK',
      mensaje: 'Datos procesados',
      datos: {
        temperatura,
        bpm,
        mascota: mascota.nombre
      },
      alertas: alertas.length ? alertas : ['Sin alertas']
    });

  } catch (error) {
    console.error('❌ Error en /datos:', error);
    res.status(500).json({
      status: 'ERROR',
      mensaje: 'Hubo un problema al procesar los datos',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
