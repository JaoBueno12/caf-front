// Arquivo: src/app/(app)/index.tsx
import { Redirect } from 'expo-router';

export default function AppIndex() {
  // Redireciona para a tela de cardápio principal
  return <Redirect href="../menu" />;
}