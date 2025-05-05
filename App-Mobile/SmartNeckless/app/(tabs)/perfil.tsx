import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import API from '@/services/apiSmartNeckless';
import MascotaCard from '@/components/MascotaCard';

export default function Profile() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { user, logout, login } = useAuth();
  const router = useRouter();

  const mascotas = user?.mascotas || [];

  const handleVerTodo = () => router.push('/mascotas');
  const handleLogout = () => logout();

  const handleSeleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      subirImagen(image.uri);
    }
  };

  const subirImagen = async (uri: string) => {
    try {
      const res = await API.subirImagenUsuario(user?.id, uri);
      if (res.statusCode === 200 && user) {
        const nuevaUrl = res.body.imagen_url;
        login({
          ...user,
          imagen_url: nuevaUrl
        });        
      } else {
        Alert.alert('Error', res.body?.error || 'No se pudo subir la imagen');
      }
    } catch (error) {
      console.error('Error al subir imagen:', error);
      Alert.alert('Error', 'Falló la subida');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={handleSeleccionarImagen}>
        <Image
          source={
            user?.imagen_url
              ? { uri: user.imagen_url }
              : require('../../assets/images/icon.png')
          }
          style={styles.avatar}
        />
      </TouchableOpacity>

      <Text style={styles.nombre}>{user?.nombre}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.mascotasContainer}>
        {mascotas.slice(0, 4).map((m) => (
          <MascotaCard key={m.id} mascota={m} />
        ))}
      </View>

      {mascotas.length > 4 && (
        <TouchableOpacity onPress={handleVerTodo} style={styles.botonVerTodo}>
          <Text style={styles.botonTexto}>Ver todas las mascotas</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: theme === 'dark' ? '#25292e' : '#f2f2f2',
      alignItems: 'center',
      paddingVertical: 32,
      paddingHorizontal: 16,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 16,
    },
    nombre: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#fff' : '#000',
    },
    email: {
      fontSize: 16,
      color: theme === 'dark' ? '#aaa' : '#444',
      marginBottom: 24,
    },
    mascotasContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 12,
    },
    mascotaCard: {
      backgroundColor: theme === 'dark' ? '#333' : '#fff',
      padding: 12,
      borderRadius: 8,
      width: 140,
      margin: 6,
      alignItems: 'center',
      elevation: 2,
    },
    mascotaNombre: {
      fontWeight: 'bold',
      fontSize: 16,
      color: theme === 'dark' ? '#fff' : '#000',
    },
    mascotaRaza: {
      fontSize: 14,
      color: theme === 'dark' ? '#ccc' : '#666',
    },
    botonVerTodo: {
      marginTop: 16,
      backgroundColor: '#0a84ff',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 6,
    },
    botonTexto: {
      color: '#fff',
      fontWeight: '600',
    },
    logoutButton: {
      marginTop: 32,
      padding: 12,
      borderRadius: 6,
      borderColor: '#ff3b30',
      borderWidth: 1,
    },
    logoutText: {
      color: '#ff3b30',
      fontWeight: '600',
    },
  });
