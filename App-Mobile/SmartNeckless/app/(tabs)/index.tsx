import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function Home() {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
    </View>
  );
}

const createStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === 'dark' ? '#25292e' : '#f2f2f2',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 18,
    },
  });
