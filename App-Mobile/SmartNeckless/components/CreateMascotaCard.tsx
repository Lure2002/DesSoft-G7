import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Heart, MapPin, ArrowRight, Warning, Plus } from 'phosphor-react-native';

export default function CreateMascotaCard() {
  const theme = useTheme();
  const isDark = theme === 'dark';
  const styles = createStyles(isDark);

  return (
    <>
      <TouchableOpacity style={styles.card}>
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

            <View style={styles.statusItem}>
              <MapPin size={16} color="#0a84ff" />
              <ArrowRight size={16} color="#0a84ff" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: "transparent",
      borderColor: "#ffd33da1",
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
