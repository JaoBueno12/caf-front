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
import { Link, router } from "expo-router";
import { fetchJson } from "@/utils/api";
import { useAuthStore } from '@/stores/auth-store';

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const setToken = useAuthStore((state) => state.setToken);

  async function handleRegister() {
    // ... a lógica da função continua a mesma ...
    if (!name.trim() || !email.trim() || !password.trim()) {
      return Alert.alert("Registro", "Por favor, preencha todos os campos.");
    }
    setIsLoading(true);
    try {
      const data = await fetchJson("/register", {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      if (data.token && data.user) {
        setToken(data.token, data.user);
        router.replace("../app/menu");
      } else {
        throw new Error("Resposta inválida do servidor");
      }

    } catch (error: any) {
      console.error("Erro de registro:", error);
      if (error.message && error.message.includes('400')) {
        Alert.alert("Erro", "Este e-mail já está em uso. Tente outro.");
      } else {
        Alert.alert("Erro", "Não foi possível criar a conta. Tente novamente.");
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
            source={{ uri: "https://images.unsplash.com/photo-1554118811-1e0d_58224f24" }}
            className="flex-1"
            resizeMode="cover"
          />
        </View>
        <View className="bg-white px-8 py-12 rounded-t-3xl -mt-8">
          <Text className="text-2xl font-bold text-gray-800 text-center mb-8">
            Crie sua Conta
          </Text>
          <View className="space-y-4 mb-6">
            <View className="bg-gray-50 rounded-xl px-4 py-4">
              <TextInput
                placeholder="Nome completo"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                className="text-gray-800 text-base"
                autoCapitalize="words"
              />
            </View>
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
            onPress={handleRegister}
            className="bg-orange-500 rounded-xl py-4 mb-4 items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Registrar
              </Text>
            )}
          </TouchableOpacity>
          <Text className="text-gray-600 text-center text-sm">
            Já tem uma conta?{" "}
            <Link href ="/login" className="text-orange-500 font-medium">
              Faça login
            </Link>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}