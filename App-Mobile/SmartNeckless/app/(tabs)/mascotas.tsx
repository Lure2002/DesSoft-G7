import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import MascotaCard from '@/components/MascotaCard';
import { useAuth } from '@/context/AuthContext';
import CreateMascotaCard from '@/components/CreateMascotaCard';

export default function Pets() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { user } = useAuth();
  const mascotas = user?.mascotas || [];

  return (
    <View style={styles.container}>
      {
        mascotas.length === 0 ? 
          <CreateMascotaCard /> : 
        mascotas.map((m,key) => <MascotaCard key={key} mascota={m} />)
      }
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
    },
    text: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 18,
    },
  });
