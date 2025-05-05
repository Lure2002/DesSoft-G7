async function crearUsuario (nombre, email, password) {
    return fetch("https://dessoft-g7.onrender.com/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: nombre,
            email: email,
            password: password
        })
    })
    .then(res => res.json())
    .catch(err => console.error(err))
}

async function loginrUsuario (email, password) {
    return fetch("https://dessoft-g7.onrender.com/usuarios/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(res => res.json())
    .catch(err => console.error(err))
}

async function getUsuarios () {
    return fetch("https://dessoft-g7.onrender.com/usuarios")
    .then(res => res.json())
    .catch(err => console.error(err))
}

async function getUsuario (id) {
    return fetch(`https://dessoft-g7.onrender.com/usuarios/${id}`)
    .then(res => res.json())
    .catch(err => console.error(err))
}

async function deleteUsuario (id) {
    return fetch(`https://dessoft-g7.onrender.com/usuarios/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .catch(err => console.error(err))
}

async function getMascotas (id) {
    return fetch(`https://dessoft-g7.onrender.com/usuarios/${id}/mascotas`)
    .then(res => res.json())
    .catch(err => console.error(err))
}

async function crearMascota (nombre, raza, id_user) {
    return fetch("https://dessoft-g7.onrender.com/mascotas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: nombre,
            raza: raza,
            id_user: id_user
        })
    })
    .then(res => res.json())
    .catch(err => console.error(err))
}

async function deleteMascota (id) {
    return fetch(`https://dessoft-g7.onrender.com/mascotas/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .catch(err => console.error(err))
}

async function deleteMascotasUsuario (id) {
    return fetch(`https://dessoft-g7.onrender.com/mascotas/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .catch(err => console.error(err))
}

async function subirImagenUsuario(id, uri) {
    const formData = new FormData();
    formData.append('imagen', {
        uri,
        name: 'perfil.jpg',
        type: 'image/jpeg',
    });

    return fetch(`https://dessoft-g7.onrender.com/usuarios/${id}/imagen`, {
        method: 'POST',
        body: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    .then(res => res.json())
    .catch(err => console.error(err));
}

async function subirImagenMascota(id, uri) {
    const formData = new FormData();
    formData.append('imagen', {
        uri,
        name: 'mascota.jpg',
        type: 'image/jpeg',
    });

    return fetch(`https://dessoft-g7.onrender.com/mascotas/${id}/imagen`, {
        method: 'POST',
        body: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    .then(res => res.json())
    .catch(err => console.error(err));
}

const API = {
    crearUsuario,
    loginrUsuario,
    getUsuarios,
    getUsuario,
    deleteUsuario,
    getMascotas,
    crearMascota,
    deleteMascota,
    deleteMascotasUsuario,
    subirImagenUsuario,
    subirImagenMascota // ✅ ahora también mascotas
};

export default API;
