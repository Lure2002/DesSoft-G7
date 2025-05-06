import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Mascota {
  id: number;
  nombre: string;
  raza: string;
  imagen_url?: string;
  pulsaciones: number;
  latitud: number;
  longitud: number;
  estado_ansiedad: string; // "Alta", "Media", etc.
  especie: string;
  ultimaActualizacion: string;
}

interface User {
  id: number;
  nombre: string;
  email: string;
  imagen_url?: string;
  mascotas: Mascota[];
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
