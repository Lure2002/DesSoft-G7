-- CreateEnum
CREATE TYPE "SexoTipo" AS ENUM ('macho', 'hembra');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100),
    "hash_contrasenia" TEXT NOT NULL,
    "imagen_url" TEXT,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mascotas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_raza" INTEGER,
    "id_especie" INTEGER,
    "pulsaciones" INTEGER,
    "estado_ansiedad" VARCHAR(50),
    "latitud" DECIMAL(10,8),
    "longitud" DECIMAL(11,8),
    "ultima_actualizacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "imagen_url" TEXT,
    "sexo" "SexoTipo" NOT NULL DEFAULT 'macho',

    CONSTRAINT "mascotas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "especies" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,

    CONSTRAINT "especies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "razas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "id_especie" INTEGER NOT NULL,

    CONSTRAINT "razas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mascotas_nombre_key" ON "mascotas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "especies_nombre_key" ON "especies"("nombre");

-- AddForeignKey
ALTER TABLE "mascotas" ADD CONSTRAINT "fk_especie" FOREIGN KEY ("id_especie") REFERENCES "especies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mascotas" ADD CONSTRAINT "fk_raza" FOREIGN KEY ("id_raza") REFERENCES "razas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mascotas" ADD CONSTRAINT "mascotas_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "razas" ADD CONSTRAINT "razas_id_especie_fkey" FOREIGN KEY ("id_especie") REFERENCES "especies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
