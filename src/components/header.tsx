// Importa componentes básicos do React Native
import { View, Text, TouchableOpacity } from "react-native";
// Importa ícones do Expo
import { Feather } from "@expo/vector-icons";
// Importa cores do Tailwind CSS
import colors from "tailwindcss/colors";
// Importa componentes de navegação
import { Link, useRouter } from "expo-router";
// NOVO: Importa a store de autenticação para o logout
import { useAuthStore } from "@/stores/auth-store";

// Define as propriedades que o componente Header recebe
type HeaderProps = {
  title: string;
  cartQuantityItem?: number;
  showLogout?: boolean;
};

export function Header({ title, cartQuantityItem = 0, showLogout = false }: HeaderProps) {
  const router = useRouter();
  // NOVO: Pega a função de logout da store
  const { logout } = useAuthStore();
  
  // FUNÇÃO DE LOGOUT CORRIGIDA
  function handleLogout() {
    logout(); // Limpa o token e os dados do usuário
    router.replace("/login"); // Redireciona para a tela de login
  }
  
  return (
    <View className="flex-row items-center border-b border-gray-200 pb-5 mx-5 pt-4">
      {showLogout ? (
        <TouchableOpacity className="mr-4" onPress={handleLogout}>
          <Feather name="log-out" color={colors.gray[800]} size={24} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity className="mr-4" onPress={() => router.back()}>
          <Feather name="arrow-left" color={colors.gray[800]} size={24} />
        </TouchableOpacity>
      )}
      
      <View className="flex-1">
        <Text className="text-gray-800 text-xl font-bold text-center">{title}</Text>
      </View>

      {/* LINK DO CARRINHO CORRIGIDO */}
      <Link href={"/cart" as any} asChild>
        <TouchableOpacity className="relative">
          {cartQuantityItem > 0 && (
            <View className="bg-orange-500 w-4 h-4 rounded-full items-center justify-center top-2 z-10 -right-3.5">
              <Text className="text-white font-bold text-xs">
                {cartQuantityItem}
              </Text>
            </View>
          )}
          <Feather name="shopping-bag" color={colors.gray[800]} size={24} />
        </TouchableOpacity>
      </Link>
    </View>
  );
}