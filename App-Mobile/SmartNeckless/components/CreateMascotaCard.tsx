import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import { Heart, MapPin, ArrowRight, Warning, Plus, X } from 'phosphor-react-native';

export default function CreateMascotaCard() {
  const theme = useTheme();
  const isDark = theme === 'dark';
  const styles = createStyles(isDark);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    especie: '',
    sexo: '',
    raza: '',
  });
  const [imagen, setImagen] = useState<string | null>(null);

  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => {
    setModalVisible(false);
    setForm({ nombre: '', especie: '', sexo: '', raza: '' });
    setImagen(null);
  };

  const handleSeleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImagen(result.assets[0].uri);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={handleOpenModal}>
        <TouchableOpacity style={styles.imageWrapper}>
          <Plus size={48} color={isDark ? '#fff' : '#000'} weight="regular" />
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.nombre}>{"Nueva Mascota"}</Text>
          <Text style={styles.raza}>{" Raza"}</Text>

          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Heart size={16} color="#ff4757" />
              <Text style={styles.statusText}>{" - "} bpm</Text>
            </View>

            <View style={styles.statusItem}>
              <Warning size={16} color="#ffa502" />
              <Text style={styles.statusText}>{" - "}</Text>
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
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
              <X size={24} color={isDark ? '#fff' : '#000'} />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
              <TouchableOpacity onPress={handleSeleccionarImagen}>
                {imagen ? (
                  <Image source={{ uri: imagen }} style={styles.modalImage} />
                ) : (
                  <View style={[styles.modalImage, styles.placeholder]}>
                    <Plus size={32} color="#888" />
                    <Text style={{ color: '#888', marginTop: 4 }}>Agregar imagen</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Nombre"
                placeholderTextColor="#888"
                value={form.nombre}
                onChangeText={(text) => setForm({ ...form, nombre: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Especie"
                placeholderTextColor="#888"
                value={form.especie}
                onChangeText={(text) => setForm({ ...form, especie: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Sexo"
                placeholderTextColor="#888"
                value={form.sexo}
                onChangeText={(text) => setForm({ ...form, sexo: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Raza"
                placeholderTextColor="#888"
                value={form.raza}
                onChangeText={(text) => setForm({ ...form, raza: text })}
              />

              <Pressable style={styles.actionButton} onPress={() => {
                // Acá podrías subir a la API si querés
                console.log('Enviar mascota:', { ...form, imagen });
                handleCloseModal();
              }}>
                <Text style={styles.actionText}>Crear Mascota</Text>
              </Pressable>
            </ScrollView>
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
      backgroundColor: 'transparent',
      borderColor: '#ffd33da1',
      borderStyle: 'dashed',
      borderWidth: 3,
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
      padding: 20,
      borderRadius: 20,
      width: '90%',
      maxHeight: '90%',
    },
    modalImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 16,
    },
    placeholder: {
      backgroundColor: '#eee',
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      width: '100%',
      padding: 10,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 12,
      color: isDark ? '#fff' : '#000',
    },
    actionButton: {
      backgroundColor: '#0a84ff',
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
    },
    actionText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 10,
    },
  });
