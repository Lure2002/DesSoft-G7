const express = require('express')
const { PrismaClient } = require('@prisma/client')
const app = express()
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')

app.use(express.json())

app.get('/usuarios', async (req, res) => {
  const usuarios = await prisma.usuario.findMany()
  res.json(usuarios)
})

app.post('/usuarios', async (req, res) => {
  const nuevo = await prisma.usuario.create({
    data: { nombre: req.body.nombre, email: req.body.email, hash_contrasenia: await bcrypt.hash(req.body.password, 10) }
  })
  res.json(nuevo)
})

app.listen(3000, () => console.log('API escuchando en http://localhost:3000'))