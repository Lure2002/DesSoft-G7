// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

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
      especieId: perro.id,
      temperaturaNormalMin: 38.0,
      temperaturaNormalMax: 39.2,
      pulsacionesNormalesMin: 60,
      pulsacionesNormalesMax: 100,
    },
    {
      nombre: 'Pastor Alemán',
      especieId: perro.id,
      temperaturaNormalMin: 37.5,
      temperaturaNormalMax: 39.0,
      pulsacionesNormalesMin: 70,
      pulsacionesNormalesMax: 120,
    },
    {
      nombre: 'Poodle',
      especieId: perro.id,
      temperaturaNormalMin: 38.0,
      temperaturaNormalMax: 39.0,
      pulsacionesNormalesMin: 70,
      pulsacionesNormalesMax: 110,
    },
    {
      nombre: 'Bulldog Inglés',
      especieId: perro.id,
      temperaturaNormalMin: 37.0,
      temperaturaNormalMax: 38.5,
      pulsacionesNormalesMin: 60,
      pulsacionesNormalesMax: 100,
    },
    {
      nombre: 'Golden Retriever',
      especieId: perro.id,
      temperaturaNormalMin: 38.0,
      temperaturaNormalMax: 39.0,
      pulsacionesNormalesMin: 70,
      pulsacionesNormalesMax: 110,
    },

    // Razas de gato
    {
      nombre: 'Siamés',
      especieId: gato.id,
      temperaturaNormalMin: 38.0,
      temperaturaNormalMax: 39.0,
      pulsacionesNormalesMin: 110,
      pulsacionesNormalesMax: 140,
    },
    {
      nombre: 'Persa',
      especieId: gato.id,
      temperaturaNormalMin: 38.0,
      temperaturaNormalMax: 39.0,
      pulsacionesNormalesMin: 110,
      pulsacionesNormalesMax: 140,
    },
    {
      nombre: 'Maine Coon',
      especieId: gato.id,
      temperaturaNormalMin: 38.0,
      temperaturaNormalMax: 39.0,
      pulsacionesNormalesMin: 110,
      pulsacionesNormalesMax: 140,
    },
    {
      nombre: 'Bengala',
      especieId: gato.id,
      temperaturaNormalMin: 38.0,
      temperaturaNormalMax: 39.0,
      pulsacionesNormalesMin: 110,
      pulsacionesNormalesMax: 140,
    },
    {
      nombre: 'Ragdoll',
      especieId: gato.id,
      temperaturaNormalMin: 38.0,
      temperaturaNormalMax: 39.0,
      pulsacionesNormalesMin: 110,
      pulsacionesNormalesMax: 140,
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