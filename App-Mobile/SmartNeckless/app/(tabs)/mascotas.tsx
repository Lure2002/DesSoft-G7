import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import MascotaCard from '@/components/MascotaCard';
import { useAuth } from '@/context/AuthContext';
import CreateMascotaCard from '@/components/CreateMascotaCard';
import Toast from 'react-native-toast-message';

export default function Pets() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { user, updateUser } = useAuth();
  const [mascotas, setMascotas] = useState(user?.mascotas || []);

  const handleMascotaCreada = (nuevaMascota: {
    nombre: string;
    especie: string;
    sexo: string;
    raza: string;
    imagen?: string;
  }) => {
    try {

      const mascotaConId = {
        ...nuevaMascota,
        id: Date.now(), 
        pulsaciones: 0,
        latitud: 0,
        longitud: 0,
        estado_ansiedad: "Normal",
        ultimaActualizacion: new Date().toISOString()
      };

      const updatedMascotas = [...mascotas, mascotaConId];
      setMascotas(updatedMascotas);

      if (updateUser && user) {
        updateUser({
          mascotas: updatedMascotas
        });
      }

      Toast.show({
        type: 'exito',
        text1: 'Mascota creada',
        text2: `${nuevaMascota.nombre} ha sido agregada correctamente`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo guardar la mascota',
      });
      console.error('Error al guardar mascota:', error);
    }
  };

  return (
    <View style={styles.container}>
      {mascotas.map((m, index) => (
        <MascotaCard key={m.id || `mascota-${index}`} mascota={m} />
      ))}
      <CreateMascotaCard onMascotaCreada={handleMascotaCreada} />
    </View>
  );
}

const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#25292e' : '#f2f2f2',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingVertical: 16,
    },
    text: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 18,
    },
  });