import { Stack } from "expo-router";

export default function MascotasLayout() {
  return <Stack>
    <Stack.Screen name="mascotas" options={{ headerShown: false }} />
    <Stack.Screen name="[id]" options={{ headerShown: false }} />
  </Stack>;
}