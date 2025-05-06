const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { bucket } = require('./firebase');

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

app.post('/usuarios/:id/imagen', upload.single('imagen'), async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) return response(res, 400, 'Bad Request', { error: 'No se envió una imagen' });

    const blob = bucket.file(`usuarios/${Date.now()}-${file.originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    blobStream.end(file.buffer);

    blobStream.on('error', (err) => {
      console.error(err);
      return response(res, 500, 'Error al subir imagen', { error: err.message });
    });

    blobStream.on('finish', async () => {
      const [url] = await blob.getSignedUrl({
        action: 'read',
        expires: '03-01-2030',
      });

      const usuarioActualizado = await prisma.usuarios.update({
        where: { id: Number(id) },
        data: { imagen_url: url },
      });

      return response(res, 200, 'Imagen subida correctamente', {
        imagen_url: url,
        usuario: usuarioActualizado
      });
    });

  } catch (error) {
    return response(res, 500, 'Internal Server Error', { error: error.message });
  }
});


app.post('/mascotas', async (req, res) => {
  try {
    const { nombre, sexo, id_raza, id_especie, id_user, pulsaciones, estado_ansiedad, latitud, longitud } = req.body;
    const nuevaMascota = await prisma.mascotas.create({
      data: {
        nombre,
        sexo,
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

app.post('/mascotas/:id/imagen', upload.single('imagen'), async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) return response(res, 400, 'Bad Request', { error: 'No se envió una imagen' });

    const blob = bucket.file(`mascotas/${Date.now()}-${file.originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    blobStream.end(file.buffer);

    blobStream.on('error', (err) => {
      console.error(err);
      return response(res, 500, 'Error al subir imagen', { error: err.message });
    });

    blobStream.on('finish', async () => {
      const [url] = await blob.getSignedUrl({
        action: 'read',
        expires: '03-01-2030',
      });

      const mascotaActualizada = await prisma.mascotas.update({
        where: { id: Number(id) },
        data: { imagen_url: url },
      });

      return response(res, 200, 'Imagen subida correctamente', {
        imagen_url: url,
        mascota: mascotaActualizada
      });
    });

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

app.get('/razas', async (req, res) => {
  try {
    const razas = await prisma.razas.findMany();
    return response(res, 200, 'OK', razas);
  } catch (error) {
    return response(res, 500, 'Internal Server Error', { error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
