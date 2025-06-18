import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import MascotaCard from '@/components/MascotaCard';
import { useAuth } from '@/context/AuthContext';
import CreateMascotaCard from '@/components/CreateMascotaCard';
import Toast from 'react-native-toast-message';
import API from '@/services/apiSmartNeckless';
import { Spinner } from 'phosphor-react-native';

export default function Pets() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { user, updateUser } = useAuth();
  const [mascotas, setMascotas] = useState(user?.mascotas || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.getMascotas(user?.id)
      .then((response) => {
        setMascotas(response.body);
        updateUser({ ...user, mascotas: response.body });
      })
      .catch((error) => {
        console.error('Error fetching mascotas:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudieron cargar las mascotas.',
        });
      });
    setLoading(false);
  }, []);

  if (loading) return <Spinner size="large" />;

  return (
    <View style={styles.container}>
      {mascotas.map((m, index) => (
        <MascotaCard key={m.id || `mascota-${index}`} mascota={m} />
      ))}
      <CreateMascotaCard />
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