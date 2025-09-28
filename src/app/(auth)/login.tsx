import { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// IMPORT CORRIGIDO: Link vem do expo-router
import { router, Link } from "expo-router"; 

// CAMINHOS CORRIGIDOS
import { fetchJson } from "@/utils/api";
import { useAuthStore } from '@/stores/auth-store';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const setToken = useAuthStore((state) => state.setToken);

  async function handleLogin() {
    // Validações no frontend
    if (!email.trim()) {
      return Alert.alert("Erro", "Por favor, digite seu e-mail.");
    }
    
    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return Alert.alert("Erro", "Por favor, digite um e-mail válido.");
    }
    
    if (!password.trim()) {
      return Alert.alert("Erro", "Por favor, digite sua senha.");
    }

    setIsLoading(true);
    
    try {
      console.log("🔄 Tentando fazer login:", { email: email.trim().toLowerCase() });
      
      const data = await fetchJson("/auth/login", {
        method: 'POST',
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password: password 
        }),
      });

      console.log("✅ Resposta do servidor:", data);

      if (data.token && data.user) {
        console.log("🎉 Login realizado com sucesso!");
        setToken(data.token, data.user);
        Alert.alert("Sucesso", `Bem-vindo de volta, ${data.user.name}!`);
        router.replace("/menu");
      } else {
        throw new Error("Resposta inválida do servidor");
      }

    } catch (error: any) {
      console.error("❌ Erro de login:", error);
      
      if (error.message && error.message.includes('Credenciais inválidas')) {
        Alert.alert("Erro", "E-mail ou senha inválidos. Tente novamente.");
      } else if (error.message && error.message.includes('Conta desativada')) {
        Alert.alert("Erro", "Sua conta está desativada. Entre em contato com o suporte.");
      } else if (error.message && error.message.includes('401')) {
        Alert.alert("Erro", "E-mail ou senha inválidos. Tente novamente.");
      } else if (error.message && error.message.includes('400')) {
        Alert.alert("Erro", "Dados inválidos. Verifique os campos preenchidos.");
      } else if (error.message && error.message.includes('500')) {
        Alert.alert("Erro", "Erro interno do servidor. Tente novamente em alguns minutos.");
      } else {
        Alert.alert("Erro", "Não foi possível fazer login. Verifique sua conexão e tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-gray-100">
          <ImageBackground
            source={{ uri: "https://images.unsplash.com/photo-1554118811-1e0d58224f24" }}
            className="flex-1"
            resizeMode="cover"
          />
        </View>
        <View className="bg-white px-8 py-12 rounded-t-3xl -mt-8">
          <Text className="text-2xl font-bold text-gray-800 text-center mb-8">
            Bem vindo ao Café
          </Text>
          <View className="space-y-4 mb-6">
            <View className="bg-gray-50 rounded-xl px-4 py-4">
              <TextInput
                placeholder="E-mail"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                className="text-gray-800 text-base"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <View className="bg-gray-50 rounded-xl px-4 py-4">
              <TextInput
                placeholder="Senha"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="text-gray-800 text-base"
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-orange-500 rounded-xl py-4 mb-4 items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Logar
              </Text>
            )}
          </TouchableOpacity>
          <Text className="text-gray-600 text-center text-sm">
            Não tem conta?{" "}
            <Link href="/register" className="text-orange-500 font-medium">
              Clique para registrar-se
            </Link>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}