import React, { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Dog, Cat, Heart, MapPin, ArrowRight, Warning } from 'phosphor-react-native';
import API from '@/services/apiSmartNeckless';
import { Mascota } from '@/context/AuthContext';

interface Props {
  mascota: Mascota;
}

export default function MascotaCard({ mascota }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme === 'dark';
  const styles = createStyles(isDark);
  const [modalVisible, setModalVisible] = useState(false);
  const [mascotaActual, setMascotaActual] = useState(mascota);

  const handleNavigate = () => router.push(`/mascotas?id=${mascotaActual.id}`);

  const handleImagePress = () => setModalVisible(true);

  const handleDescargarImagen = async () => {
    if (!mascotaActual.imagen_url) return;
  
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'No se puede acceder a la galería.');
      return;
    }
  
    try {
      const fileUri = FileSystem.documentDirectory + `mascota-${mascotaActual.id}.jpg`;
      const download = await FileSystem.downloadAsync(mascotaActual.imagen_url, fileUri);
      await MediaLibrary.saveToLibraryAsync(download.uri);
      Alert.alert('Éxito', 'Imagen guardada en la galería.');
    } catch (error) {
      console.error('Error al guardar imagen:', error);
      Alert.alert('Error', 'No se pudo guardar la imagen.');
    }
  };  

  const handleCambiarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      try {
        const res = await API.subirImagenMascota(mascotaActual.id, image.uri);
        if (res.statusCode === 200) {
          setMascotaActual((prev) => ({
            ...prev,
            imagen_url: res.body.imagen_url,
          }));
        } else {
          Alert.alert('Error', res.body?.error || 'No se pudo subir la imagen');
        }
      } catch (err) {
        console.error('Error al subir imagen:', err);
        Alert.alert('Error', 'Falló la subida');
      }
    }
  };

  return (
    <>
      <TouchableOpacity onPress={handleNavigate} style={styles.card}>
        <TouchableOpacity onPress={handleImagePress} style={styles.imageWrapper}>
          {mascotaActual.imagen_url ? (
            <Image source={{ uri: mascotaActual.imagen_url }} style={styles.image} />
          ) : mascotaActual.especie === 'gato' ? (
            <Cat size={48} color={isDark ? '#fff' : '#000'} weight="regular" />
          ) : (
            <Dog size={48} color={isDark ? '#fff' : '#000'} weight="regular" />
          )}
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.nombre}>{mascotaActual.nombre}</Text>
          <Text style={styles.raza}>{mascotaActual.raza}</Text>

          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Heart size={16} color="#ff4757" />
              <Text style={styles.statusText}>{mascotaActual.pulsaciones} bpm</Text>
            </View>

            <View style={styles.statusItem}>
              <Warning size={16} color="#ffa502" />
              <Text style={styles.statusText}>{mascotaActual.ansiedad}</Text>
            </View>

            <View style={styles.statusItemEnd}>
              <MapPin size={16} color="#0a84ff" />
              <ArrowRight size={16} color="#0a84ff" />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {mascotaActual.imagen_url ? (
              <Image source={{ uri: mascotaActual.imagen_url }} style={styles.modalImage} />
            ) : (
              <Text style={{ color: isDark ? '#fff' : '#000' }}>Sin imagen</Text>
            )}
            <View style={styles.modalActions}>
            <Pressable onPress={handleDescargarImagen} style={styles.actionButton}>
              <Text style={styles.actionText}>Descargar</Text>
            </Pressable>
              <Pressable onPress={handleCambiarImagen} style={styles.actionButton}>
                <Text style={styles.actionText}>Cambiar</Text>
              </Pressable>
              <Pressable onPress={() => setModalVisible(false)} style={styles.actionButton}>
                <Text style={styles.actionText}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: isDark ? '#333' : '#fff',
      padding: 12,
      marginVertical: 8,
      borderRadius: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    imageWrapper: {
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
      width: 64,
      height: 64,
    },
    image: {
      width: 64,
      height: 64,
      borderRadius: 32,
      resizeMode: 'cover',
    },
    info: {
      flex: 1,
      justifyContent: 'center',
    },
    nombre: {
      fontWeight: 'bold',
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
    },
    raza: {
      fontSize: 14,
      color: isDark ? '#ccc' : '#555',
      marginBottom: 8,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statusItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    statusText: {
      fontSize: 12,
      color: isDark ? '#fff' : '#000',
    },
    statusItemEnd: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginLeft: 'auto',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: '#0009',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: isDark ? '#25292e' : '#fff',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      maxWidth: '90%',
    },
    modalImage: {
      width: 200,
      height: 200,
      borderRadius: 12,
      marginBottom: 16,
    },
    modalActions: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      backgroundColor: '#0a84ff',
      padding: 10,
      borderRadius: 6,
    },
    actionText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
