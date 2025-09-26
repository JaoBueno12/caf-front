// Arquivo: src/stores/auth-store.ts

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definindo os tipos para os dados do usuário e o estado da store
type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthState = {
  token: string | null;
  user: UserData | null;
  setToken: (token: string, user: UserData) => void;
  logout: () => void;
};

// Criando a store com persistência
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      // Ação para salvar o token e os dados do usuário
      setToken: (token: string, user: UserData) => set({ token, user }),
      // Ação para limpar os dados (logout)
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage', // Nome do item no AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Define o motor de armazenamento
    }
  )
);