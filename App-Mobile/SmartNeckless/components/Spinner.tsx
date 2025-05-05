import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface SpinnerProps {
  size?: 'small' | 'large';
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'large' }) => {
  const theme = useTheme();
  const isDark = theme === 'dark';

  const backgroundColor = isDark ? '#25292e' : '#f2f2f2';
  const spinnerColor = isDark ? '#ffffff' : '#000000';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ActivityIndicator size={size} color={spinnerColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default Spinner;
