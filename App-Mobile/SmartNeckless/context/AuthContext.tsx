import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  sexo: string;
  raza: string;
  pulsaciones: number;
  latitud: number;
  longitud: number;
  temperatura: number;
  ultimaActualizacion: string;
}

interface User {
  id: number;
  nombre: string;
  email: string;
  mascotas: Mascota[];
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);

  const updateUser = (updatedData: Partial<User>) => {
  if (user) {
    setUser({ ...user, ...updatedData });
  }
};

  return (
    <AuthContext.Provider value={{ user, login, logout,  updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
