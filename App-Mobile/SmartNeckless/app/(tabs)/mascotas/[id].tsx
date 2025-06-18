import { useLocalSearchParams, useNavigation } from "expo-router";
import { View, Text, StyleSheet, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Heart, Thermometer } from 'phosphor-react-native';
import { useTheme } from "@/context/ThemeContext";

export default function DetalleMascota() {
    const { id } = useLocalSearchParams();
    const theme = useTheme();
    const styles = createStyles(theme === 'dark');
    const navigation = useNavigation();
    // Valores hardcodeados
    const nombre = "Rocky";
    const bpm = 85;
    const temperatura = 38.5;
    const latitud = -34.6037;
    const longitud = -58.3816;

    return (
        <View style={styles.container}>
            <Image
                source={require("@/assets/images/perro.jpg")} // Asegurate de tener esta imagen o cambiala por una URL
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.nombre}>{nombre}</Text>
            <View style={styles.statusRow}>
                <View style={styles.statusItem}>
                    <Heart size={16} color="#ff4757" />
                    <Text style={styles.statusText}>{bpm} bpm</Text>
                </View>
                <Text>  · </Text>
                <View style={styles.statusItem}>
                    <Thermometer size={16} color="#5099ff" />
                    <Text style={styles.statusText}>{temperatura}℃</Text>
                </View>
            </View>
        </View>
    );
}

const createStyles = (isDark: boolean) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            backgroundColor: '#fff',
            paddingTop: 40,
        },
        image: {
            width: 150,
            height: 150,
            marginBottom: 16,
            borderRadius: 50,
            objectFit: 'cover'
        },
        nombre: {
            fontSize: 24,
            fontWeight: 'bold',
        },
        info: {
            fontSize: 16,
            color: '#666',
            marginBottom: 16,
        },
        map: {
            width: '90%',
            height: 300,
            borderRadius: 20,
            overflow: 'hidden',
        },
        statusRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10
        },
        statusItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        statusText: {
            fontSize: 12,
            color: isDark ? '#fff' : '#000',
        }
    })
};
