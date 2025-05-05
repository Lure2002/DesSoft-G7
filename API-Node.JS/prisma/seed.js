const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const perro = await prisma.especies.upsert({
    where: { nombre: 'Perro' },
    update: {},
    create: { nombre: 'Perro' },
  });

  const gato = await prisma.especies.upsert({
    where: { nombre: 'Gato' },
    update: {},
    create: { nombre: 'Gato' },
  });

  await prisma.razas.createMany({
    data: [
      { nombre: 'Labrador', id_especie: perro.id },
      { nombre: 'Golden Retriever', id_especie: perro.id },
      { nombre: 'Bulldog', id_especie: perro.id },
      { nombre: 'Beagle', id_especie: perro.id },
      { nombre: 'Poodle', id_especie: perro.id },
      { nombre: 'Boxer', id_especie: perro.id },
      { nombre: 'Dachshund', id_especie: perro.id },
      { nombre: 'Siberian Husky', id_especie: perro.id },
      { nombre: 'Doberman', id_especie: perro.id },
      { nombre: 'Rottweiler', id_especie: perro.id },
      { nombre: 'Great Dane', id_especie: perro.id },
      { nombre: 'Shih Tzu', id_especie: perro.id },
      { nombre: 'Border Collie', id_especie: perro.id },
      { nombre: 'Basset Hound', id_especie: perro.id },
      { nombre: 'Akita', id_especie: perro.id },
      { nombre: 'Cocker Spaniel', id_especie: perro.id },
      { nombre: 'Mastiff', id_especie: perro.id },
      { nombre: 'Boston Terrier', id_especie: perro.id },
      { nombre: 'Pit Bull', id_especie: perro.id },
      { nombre: 'Pug', id_especie: perro.id },
      { nombre: 'Yorkshire Terrier', id_especie: perro.id },
      { nombre: 'Samoyedo', id_especie: perro.id },
      { nombre: 'Australian Shepherd', id_especie: perro.id },
      { nombre: 'Saint Bernard', id_especie: perro.id },
      { nombre: 'Bernese Mountain Dog', id_especie: perro.id },
      { nombre: 'Pomeranian', id_especie: perro.id },
  
      { nombre: 'Siames', id_especie: gato.id },
      { nombre: 'Persa', id_especie: gato.id },
      { nombre: 'Maine Coon', id_especie: gato.id },
      { nombre: 'Ragdoll', id_especie: gato.id },
      { nombre: 'Bengala', id_especie: gato.id },
      { nombre: 'Esfinge', id_especie: gato.id },
      { nombre: 'Abisinio', id_especie: gato.id },
      { nombre: 'British Shorthair', id_especie: gato.id },
      { nombre: 'Scottish Fold', id_especie: gato.id },
      { nombre: 'Oriental', id_especie: gato.id },
      { nombre: 'Devon Rex', id_especie: gato.id },
      { nombre: 'Birmano', id_especie: gato.id },
      { nombre: 'Savannah', id_especie: gato.id },
      { nombre: 'Bombay', id_especie: gato.id },
      { nombre: 'American Shorthair', id_especie: gato.id },
      { nombre: 'Siberiano', id_especie: gato.id },
      { nombre: 'Exotic Shorthair', id_especie: gato.id },
      { nombre: 'Manx', id_especie: gato.id },
      { nombre: 'Himalayo', id_especie: gato.id },
      { nombre: 'Noruego de Bosque', id_especie: gato.id },
      { nombre: 'Tonkinese', id_especie: gato.id },
      { nombre: 'Cornish Rex', id_especie: gato.id },
      { nombre: 'Foldex', id_especie: gato.id },
      { nombre: 'Balines', id_especie: gato.id },
      { nombre: 'Ocicat', id_especie: gato.id },
    ],
    skipDuplicates: true,
  });  
}

main()
  .then(() => console.log('Datos iniciales insertados'))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
