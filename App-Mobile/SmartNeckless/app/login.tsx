import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import API from '../services/apiSmartNeckless.js';
import { Redirect } from 'expo-router';
import Spinner from '@/components/Spinner';
import { useTheme } from '@/context/ThemeContext';

export default function LoginScreen() {
    const { login, user } = useAuth();
    const theme = useTheme(); // 'light' | 'dark'
    const styles = createStyles(theme);

    const [isSignUp, setIsSignUp] = useState(false);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        setErrorMessage('');

        try {
            if (isSignUp) {
                const response = await API.crearUsuario(nombre, email, password);
                if (response.statusCode === 201) {
                    login(response.body);
                } else {
                    setErrorMessage(
                        `${response.reasonPhrase} - ${response.body?.error || 'Error al crear usuario'}`
                    );
                }
            } else {
                const response = await API.loginUsuario(email, password);
                if (response.statusCode === 200) {
                    login(response.body);
                } else {
                    setErrorMessage(
                        `${response.reasonPhrase} - ${response.body?.error || 'Error al iniciar sesión'}`
                    );
                }
            }
        } catch (error) {
            setErrorMessage('Hubo un problema inesperado. Intentá de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    if (user) return <Redirect href="/(tabs)" />;
    if (loading) return <Spinner size="large" />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {isSignUp ? 'Registrarse' : 'Iniciar Sesión'}
            </Text>

            {isSignUp && (
                <TextInput
                    placeholder="Nombre"
                    value={nombre}
                    onChangeText={setNombre}
                    style={styles.input}
                    placeholderTextColor={theme === 'dark' ? '#aaa' : '#666'}
                />
            )}

            <TextInput
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                placeholderTextColor={theme === 'dark' ? '#aaa' : '#666'}
            />

            <TextInput
                placeholder="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                placeholderTextColor={theme === 'dark' ? '#aaa' : '#666'}
            />

            {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>
                    {isSignUp ? 'Crear cuenta' : 'Ingresar'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text style={styles.toggle}>
                    {isSignUp
                        ? '¿Ya tenés cuenta? Iniciá sesión'
                        : '¿No tenés cuenta? Registrate'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const createStyles = (theme: 'light' | 'dark') =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            padding: 24,
            backgroundColor: theme === 'dark' ? '#25292e' : '#f2f2f2',
        },
        title: {
            fontSize: 26,
            fontWeight: 'bold',
            marginBottom: 24,
            textAlign: 'center',
            color: theme === 'dark' ? '#fff' : '#000',
        },
        input: {
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#999' : '#ccc',
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            padding: 12,
            borderRadius: 6,
            marginBottom: 12,
            color: theme === 'dark' ? '#fff' : '#000',
        },
        button: {
            backgroundColor: '#0a84ff',
            padding: 14,
            borderRadius: 6,
            alignItems: 'center',
            marginBottom: 12,
        },
        buttonText: {
            color: '#fff',
            fontWeight: '600',
        },
        toggle: {
            textAlign: 'center',
            color: '#007aff',
        },
        error: {
            color: '#ff4d4f',
            marginBottom: 10,
            textAlign: 'center',
            fontSize: 14,
        },
    });
