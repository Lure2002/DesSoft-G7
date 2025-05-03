import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import { Text, View,  StyleSheet } from 'react-native';

export default function Index() {
  const { user } = useAuth()

  if (!user) {
    return <Redirect href="/login" />
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});
