import React, { useState } from 'react'
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useAuth } from '../context/AuthContext'
import API from '../services/apiSmartNeckless.js'
import { Redirect } from 'expo-router'

export default function LoginScreen() {
    console.log('login xd')
    const { login, user } = useAuth()
    const [isSignUp, setIsSignUp] = useState(false)
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async () => {
        try {
            if (isSignUp) {
                login(await API.crearUsuario(nombre, email, password))
            } else {
                login(await API.loginrUsuario(email, password))
            }
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema. Intentá de nuevo.')
        }
    }
    if (user) {
        return <Redirect href="/(tabs)" />
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isSignUp ? 'Registrarse' : 'Iniciar Sesión'}</Text>

            {isSignUp && (
                <TextInput
                    placeholder="Nombre"
                    value={nombre}
                    onChangeText={setNombre}
                    style={styles.input}
                />
            )}

            <TextInput
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>{isSignUp ? 'Crear cuenta' : 'Ingresar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text style={styles.toggle}>
                    {isSignUp ? '¿Ya tenés cuenta? Iniciá sesión' : '¿No tenés cuenta? Registrate'}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#25292e',
        color: '#fff',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: '#fff'
    },
    input: {
        borderWidth: 1,
        borderColor: '#999',
        padding: 12,
        borderRadius: 6,
        marginBottom: 12,
        color: '#fff',
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
})