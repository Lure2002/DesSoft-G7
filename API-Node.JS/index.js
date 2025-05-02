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

app.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params
    const usuario = await prisma.usuarios.findUnique({
        where: { id: Number(id) }
    })
    if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    res.json(usuario)
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

app.post('/usuarios/login', async (req, res) => {
    const { email, password } = req.body
    const usuario = await prisma.usuarios.findUnique({
        where: { email }
    })
    if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    const passwordValido = await bcrypt.compare(password, usuario.hash_contrasenia)
    if (!passwordValido) {
        return res.status(401).json({ error: 'Contraseña incorrecta' })
    }
    res.json({ id: usuario.id, nombre: usuario.nombre, email: usuario.email })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`))
