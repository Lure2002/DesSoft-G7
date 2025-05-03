import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
//web id: 407658309839-bvoemvht67hvrb8en4n6vok422ak7cjf.apps.googleusercontent.com secret: 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
//ios id: 407658309839-afs833lggogu3i5apb1hei2a69hf2n4e.apps.googleusercontent.com
//android id: 407658309839-7sdm9290uf7qr3q45afr08ejl3vletsb.apps.googleusercontent.com
export default function RootLayout() {
  const user = useAuth().user;
  console.log(user);

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </AuthProvider>
  )
}