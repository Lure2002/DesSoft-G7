# Importamos las librerías necesarias
import random       # Para generar datos aleatorios
import time         # Para pausar la ejecución entre envíos de datos
import requests     # Para hacer solicitudes HTTP a la API

# Clase que simula un collar inteligente para una mascota
class CollarMascota:
    def __init__(self, mascota_id):
        # Guardamos el ID de la mascota asociada al collar
        self.mascota_id = mascota_id

    def generar_temperatura(self):
        # Genera una temperatura aleatoria entre 37.0 y 41.0 grados
        return round(random.uniform(37.0, 41.0), 2)

    def generar_pulsaciones(self):
        # Genera un valor de pulsaciones por minuto entre 50 y 160
        return random.randint(50, 160)

    def generar_ubicacion(self):
        # Genera coordenadas geográficas aleatorias (latitud y longitud)
        lat = round(random.uniform(-90, 90), 6)
        lng = round(random.uniform(-180, 180), 6)
        return {"lat": lat, "lng": lng}

    def obtener_datos(self):
        # Genera un paquete de datos con temperatura, pulsaciones, ubicación y el ID de la mascota
        ubicacion = self.generar_ubicacion()
        return {
            "temperatura": self.generar_temperatura(),
            "bpm": self.generar_pulsaciones(),
            "lat": ubicacion["lat"],
            "lng": ubicacion["lng"],
            "mascotaId": self.mascota_id
        }

# Función para obtener los IDs de las mascotas asociadas a un usuario
def obtener_ids_mascotas(usuario_id, api_base_url="https://dessoft-g7-ykag.onrender.com"):
    # Se construye la URL de la API para obtener las mascotas de un usuario
    url = f"{api_base_url}/usuarios/{usuario_id}/mascotas"
    try:
        # Hacemos una solicitud GET a la API
        respuesta = requests.get(url, timeout=5)
        if respuesta.status_code == 200:
            mascotas = respuesta.json()
            if mascotas:
                # Devolvemos solo los IDs de las mascotas encontradas
                return [m["id"] for m in mascotas]
            else:
                print("No se encontraron mascotas para este usuario.")
                return []
        else:
            print(f"Error al obtener mascotas: Código {respuesta.status_code}")
            return []
    except requests.exceptions.RequestException as e:
        print("Error al conectar con la API:", str(e))
        return []

# =========================== #
#       Configuración         #
# =========================== #

USUARIO_ID = 1  # ID del usuario del que se quieren obtener las mascotas
URL_API = "https://dessoft-g7-ykag.onrender.com/datos"  # URL a la que se envían los datos simulados
INTERVALO_SEGUNDOS = 5  # Tiempo de espera entre cada envío de datos

# =========================== #
#   Inicio del programa       #
# =========================== #

if __name__ == "__main__":
    print("Conectándose a la API para obtener mascotas...")
    
    # Obtenemos los IDs de las mascotas del usuario
    mascota_ids = obtener_ids_mascotas(USUARIO_ID, URL_API.split("/datos")[0])

    if not mascota_ids:
        print("No se pueden simular datos sin mascotas registradas.")
        exit()

    print(f"Se encontraron {len(mascota_ids)} mascotas para el usuario {USUARIO_ID}")
    print("Preparando collares virtuales...\n")

    # Creamos una instancia de CollarMascota por cada mascota encontrada
    collares = [CollarMascota(mascota_id=id) for id in mascota_ids]

    print("Iniciando simulación del collar inteligente...\n")

    try:
        # Bucle infinito para enviar datos periódicamente
        while True:
            for collar in collares:
                # Obtenemos los datos simulados del collar
                datos = collar.obtener_datos()

                # Mostramos en consola los datos generados
                print(f"\nMascota {datos['mascotaId']}: Enviando datos:")
                print(datos)

                try:
                    # Enviamos los datos a la API por POST
                    respuesta = requests.post(URL_API, json=datos, timeout=5)
                    print("Respuesta de la API:", respuesta.json())
                except requests.exceptions.RequestException as e:
                    print(f"Error al enviar datos para mascota {datos['mascotaId']}: {str(e)}")

            # Esperamos el intervalo definido antes de enviar nuevos datos
            print(f"\nEsperando {INTERVALO_SEGUNDOS} segundos antes de la próxima lectura...\n")
            time.sleep(INTERVALO_SEGUNDOS)

    except KeyboardInterrupt:
        # Detenemos la simulación si el usuario presiona Ctrl+C
        print("\nSimulador detenido por el usuario.")
