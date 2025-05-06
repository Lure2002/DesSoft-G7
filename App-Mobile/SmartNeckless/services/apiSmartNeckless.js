var API_URL = 'https://dessoft-g7.onrender.com'

async function crearUsuario(nombre, email, password) {
    return fetch(API_URL + "/usuarios", {
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

async function loginUsuario(email, password) {
    return fetch(API_URL + "/usuarios/login", {
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

async function getUsuarios() {
    return fetch(API_URL + "/usuarios")
        .then(res => res.json())
        .catch(err => console.error(err))
}

async function getUsuario(id) {
    return fetch(`${API_URL}/usuarios/${id}`)
        .then(res => res.json())
        .catch(err => console.error(err))
}

async function deleteUsuario(id) {
    return fetch(`${API_URL}/usuarios/${id}`, {
        method: "DELETE"
    })
        .then(res => res.json())
        .catch(err => console.error(err))
}

async function getMascotas(id) {
    return fetch(`${API_URL}/usuarios/${id}/mascotas`)
        .then(res => res.json())
        .catch(err => console.error(err))
}

async function crearMascota(nombre, raza, id_user) {
    return fetch(API_URL + "/mascotas", {
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

async function deleteMascota(id) {
    return fetch(`${API_URL}/mascotas/${id}`, {
        method: "DELETE"
    })
        .then(res => res.json())
        .catch(err => console.error(err))
}

async function deleteMascotasUsuario(id) {
    return fetch(`${API_URL}/mascotas/${id}`, {
        method: "DELETE"
    })
        .then(res => res.json())
        .catch(err => console.error(err))
}

async function subirImagenUsuario(id, fileUri, fileName, mimeType) {
    const formData = new FormData();
    formData.append('imagen', {
        uri: fileUri,
        name: fileName || `perfil-${Date.now()}.jpg`,
        type: mimeType || 'image/jpeg',
    });

    return fetch(`${API_URL}/usuarios/${id}/imagen`, {
        method: 'POST',
        body: formData,
    })
        .then(res => res.json())
        .catch(err => {
            console.error('Error al subir imagen del usuario:', err);
        });
}


async function subirImagenMascota(id, uri) {
    const formData = new FormData();
    formData.append('imagen', {
        uri,
        name: 'mascota.jpg',
        type: 'image/jpeg',
    });

    return fetch(`${API_URL}/mascotas/${id}/imagen`, {
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
    loginUsuario,
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
