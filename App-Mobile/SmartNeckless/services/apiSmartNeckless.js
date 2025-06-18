async function crearUsuario(nombre, email, password) {
  return fetch("https://dessoft-g7-ykag.onrender.com/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre: nombre,
      email: email,
      password: password,
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));
}

async function loginUsuario(email, password) {
  return fetch("https://dessoft-g7-ykag.onrender.com/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));
}

async function getUsuario(id) {
  return fetch(`https://dessoft-g7-ykag.onrender.com/usuario/${id}`)
    .then((res) => res.json())
    .catch((err) => console.error(err));
}

async function deleteUsuario(id) {
  return fetch(`https://dessoft-g7-ykag.onrender.com/usuario/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));
}

async function getMascotas(id) {
  return fetch(`https://dessoft-g7-ykag.onrender.com/usuario/${id}/mascotas`)
    .then((res) => res.json())
    .catch((err) => console.error(err));
}

async function getMascota(id, idMascota) {
  return fetch(
    `https://dessoft-g7-ykag.onrender.com/usuario/${id}/mascota/${idMascota}`
  )
    .then((res) => res.json())
    .catch((err) => console.error(err));
}

async function crearMascota(nombre, especie, raza, sexo, id_user) {
  return fetch("https://dessoft-g7-ykag.onrender.com/mascota", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre: nombre,
      especie: especie,
      raza: raza,
      sexo: sexo,
      id_user: id_user,
    }),
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));
}

async function deleteMascota(id) {
  return fetch(`https://dessoft-g7-ykag.onrender.com/mascotas/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .catch((err) => console.error(err));
}

async function getRazas(idEspecie) {
  return fetch("https://dessoft-g7-ykag.onrender.com/razas/" + idEspecie)
    .then((res) => res.json())
    .catch((err) => console.error(err));
}

async function getEspecies() {
  return fetch("https://dessoft-g7-ykag.onrender.com/especies")
    .then((res) => res.json())
    .catch((err) => console.error(err));
}

const API = {
  crearUsuario,
  loginUsuario,
  getUsuario,
  deleteUsuario,
  getMascotas,
  getMascota,
  crearMascota,
  deleteMascota,
  getRazas,
  getEspecies
};

export default API;
