import { useEffect } from 'react';
import { Slot, router, useSegments } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { Loading } from "@/components/loading";
import { useAuthStore } from '@/stores/auth-store';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold,
  });

  const { token } = useAuthStore();
  const segments = useSegments();

  useEffect(() => {
    if (!fontsLoaded) return;

    const inApp = segments[0] === '(app)';

    if (token && !inApp) {
      router.replace('/menu');
    } else if (!token && inApp) {
      router.replace('/login');
    }
  }, [token, segments, fontsLoaded]);

  if (!fontsLoaded) {
    return <Loading />;
  }
  
  return <Slot />;
}