import React from 'react';
import { View, ActivityIndicator, StyleSheet, useColorScheme } from 'react-native';

interface SpinnerProps {
  size?: 'small' | 'large';
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'large' }) => {
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
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
