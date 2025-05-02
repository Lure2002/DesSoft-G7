const express = require('express')
const { PrismaClient } = require('@prisma/client')
const app = express()
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')

app.use(express.json())

app.get('/usuarios', async (req, res) => {
    const usuarios = await prisma.usuarios.findMany()
    res.json(usuarios)
})

app.post('/usuarios', async (req, res) => {
    const { nombre, email, password } = req.body
    const passwordHasheado = await bcrypt.hash(password, 10)
    const nuevo = await prisma.usuarios.create({
        data: {
            nombre,
            email,
            hash_contrasenia: passwordHasheado
        }
    })
    res.json({ id: nuevo.id, nombre: nuevo.nombre, email: nuevo.email })
})

app.listen(3000, () => console.log('API escuchando en http://localhost:3000'))