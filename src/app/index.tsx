// Arquivo: src/app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // Apenas redireciona. Nada mais.
  return <Redirect href="/login" />;
}