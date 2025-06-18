// prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Insertar especies si no existen
  const perro = await prisma.especie.upsert({
    where: { nombre: 'Perro' },
    update: {},
    create: { nombre: 'Perro' },
  });

  const gato = await prisma.especie.upsert({
    where: { nombre: 'Gato' },
    update: {},
    create: { nombre: 'Gato' },
  });

  // Insertar razas con valores normales
  const razasData = [
    // Razas de perro
    {
      nombre: 'Labrador Retriever',
      id_especie: perro.id,
      temp_min: 38.0,
      temp_max: 39.2,
      bpm_min: 60,
      bpm_max: 100,
    },
    {
      nombre: 'Pastor Alemán',
      id_especie: perro.id,
      temp_min: 37.5,
      temp_max: 39.0,
      bpm_min: 70,
      bpm_max: 120,
    },
    {
      nombre: 'Poodle',
      id_especie: perro.id,
      temp_min: 38.0,
      temp_max: 39.0,
      bpm_min: 70,
      bpm_max: 110,
    },
    {
      nombre: 'Bulldog Inglés',
      id_especie: perro.id,
      temp_min: 37.0,
      temp_max: 38.5,
      bpm_min: 60,
      bpm_max: 100,
    },
    {
      nombre: 'Golden Retriever',
      id_especie: perro.id,
      temp_min: 38.0,
      temp_max: 39.0,
      bpm_min: 70,
      bpm_max: 110,
    },

    // Razas de gato
    {
      nombre: 'Siamés',
      id_especie: gato.id,
      temp_min: 38.0,
      temp_max: 39.0,
      bpm_min: 110,
      bpm_max: 140,
    },
    {
      nombre: 'Persa',
      id_especie: gato.id,
      temp_min: 38.0,
      temp_max: 39.0,
      bpm_min: 110,
      bpm_max: 140,
    },
    {
      nombre: 'Maine Coon',
      id_especie: gato.id,
      temp_min: 38.0,
      temp_max: 39.0,
      bpm_min: 110,
      bpm_max: 140,
    },
    {
      nombre: 'Bengala',
      id_especie: gato.id,
      temp_min: 38.0,
      temp_max: 39.0,
      bpm_min: 110,
      bpm_max: 140,
    },
    {
      nombre: 'Ragdoll',
      id_especie: gato.id,
      temp_min: 38.0,
      temp_max: 39.0,
      bpm_min: 110,
      bpm_max: 140,
    },
  ];

  // Eliminar razas previas (opcional)
  await prisma.raza.deleteMany({});

  // Insertar nuevas razas
  await prisma.raza.createMany({
    data: razasData,
  });

  console.log('🌱 Datos iniciales insertados:', {
    especies: [perro, gato],
    razas: razasData.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });