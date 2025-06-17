import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Dog, Cat, Heart, MapPin, ArrowRight, Warning } from 'phosphor-react-native';
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
              <Text style={styles.statusText}>{mascotaActual.estado_ansiedad}</Text>
            </View>

            <View style={styles.statusItem}>
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
      width: '80%',
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
