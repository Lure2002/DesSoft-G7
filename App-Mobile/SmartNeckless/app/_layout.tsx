import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext"; // Importá el provider
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const theme = useTheme();
  return (
    <AuthProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={theme} />
      </ThemeProvider>
    </AuthProvider>
  );
}
