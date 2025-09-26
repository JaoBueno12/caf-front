import { Image, Text, View, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter, Redirect, Link } from "expo-router"; // useRouter em vez de useNavigation
import { fetchJson } from "@/utils/api";
import { formatCurrency } from "@/utils/functions/format-currency";
import { Button } from "@/components/button";
import { Feather } from "@expo/vector-icons";
import { useCartStore } from "@/stores/cart-store";
import { useEffect, useState } from "react";
import { Loading } from "@/components/loading"; // Importa o componente de Loading
import { ProductProps } from "@/types/product"; // Usa sua tipagem forte

export default function Product() {
  const cartStore = useCartStore();
  const { id } = useLocalSearchParams();
  const router = useRouter(); // Hook de roteamento recomendado para Expo Router

  // Usa a tipagem ProductProps e adiciona um estado de loading
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { product: productData } = await fetchJson(`/products/${id}`);
        
        if (productData) {
          // Garante que 'ingredients' seja sempre um array
          const ingredientsArray = Array.isArray(productData.ingredients)
            ? productData.ingredients
            : [];

          const mapped: ProductProps = {
            id: productData._id,
            title: productData.title,
            description: productData.description || '',
            price: productData.price,
            thumbnail: productData.thumbnail ? { uri: productData.thumbnail } : (productData.cover ? { uri: productData.cover } : undefined),
            cover: productData.cover ? { uri: productData.cover } : (productData.thumbnail ? { uri: productData.thumbnail } : undefined),
            ingredients: ingredientsArray,
          };
          setProduct(mapped);
        }
      } catch (error) {
        console.error("Falha ao buscar produto:", error);
        // Se der erro (ex: produto não encontrado), podemos redirecionar
        // router.replace("/"); // Descomente se quiser redirecionar em caso de erro
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProduct();
  }, [id]);

  function handleAddToCart() {
    if (product) {
      cartStore.add(product);
      router.back();
    }
  }

  // Se estiver carregando, mostra o componente de Loading
  if (isLoading) {
    return <Loading />;
  }
  
  // Se parou de carregar e o produto não foi encontrado, redireciona
  if (!product) {
    return <Redirect href="/" />; // Redireciona para a página inicial
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between p-5">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        {/* Funcionalidade de Favoritos (futura) */}
      </View>

      {product.cover && (
        <Image
          source={product.cover}
          className="w-full h-52"
          resizeMode="cover"
        />
      )}

      <View className="p-5 flex-1">
        <Text className="text-gray-800 text-2xl font-bold mb-2">{product.title}</Text>
        <Text className="text-orange-500 text-xl font-bold mb-4">
          {formatCurrency(product.price)}
        </Text>
        
        <Text className="text-gray-600 text-base leading-6 mb-6">
          {product.description}
        </Text>

        {product.ingredients.length > 0 && (
          <Text className="text-gray-800 text-lg font-bold mb-3">Ingredientes</Text>
        )}
        {product.ingredients.map((ingredient) => (
          <Text
            key={ingredient}
            className="text-gray-600 text-base leading-6"
          >
            • {ingredient}
          </Text>
        ))}
      </View>

      <View className="p-5 gap-4">
        <Button onPress={handleAddToCart} className="bg-orange-500">
          <Button.Text className="text-white">Adicionar ao carrinho</Button.Text>
        </Button>

        <Link href="/" asChild>
          <Button className="bg-gray-200">
            <Button.Text className="text-gray-800">Voltar ao cardápio</Button.Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}