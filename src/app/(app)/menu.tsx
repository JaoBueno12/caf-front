import { View, Text, FlatList, SectionList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/header";
import { CategoryButton } from "@/components/category-button";
import { Product } from "@/components/products";
import { CATEGORIES, MENU, fetchProducts, fetchCategories } from "@/utils/data/products";
import { ProductProps } from "@/types/product";
import { useState, useRef, useEffect } from "react";
import { Link } from "expo-router";
import { useCartStore } from "@/stores/cart-store";

export default function Menu() {
  const cartStore = useCartStore();
  const sectionListRef = useRef<SectionList<ProductProps>>(null);

  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);

  const cartQuantyItems = cartStore.products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, productsData] = await Promise.all([
        fetchCategories(),
        fetchProducts()
      ]);
      
      setCategories(categoriesData);
      setProducts(productsData);
      
      if (categoriesData.length > 0) {
        setCategory(categoriesData[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Fallback para dados locais
      setCategories(CATEGORIES);
      setProducts(MENU.map((item) => item.data).flat());
      setCategory(CATEGORIES[0] || "");
    } finally {
      setLoading(false);
    }
  };

  function handleCategorySelect(selectedCategory: string) {
    setCategory(selectedCategory);
    const sectionIndex = categories.findIndex(
      (cat) => cat === selectedCategory
    );
    if (sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        animated: true,
        sectionIndex,
        itemIndex: 0,
      });
    }
  }

  const sections = categories.map((cat) => ({
    title: cat,
    data: products.filter((product) => product.category === cat),
  }));

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title="Cardápio" cartQuantityItem={cartQuantyItems} showLogout={true} />
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Carregando cardápio...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    // CORREÇÃO 2: Usa SafeAreaView para o layout principal
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Cardápio" cartQuantityItem={cartQuantyItems} showLogout={true} />

      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <CategoryButton
            title={item}
            isSelected={item === category}
            onPress={() => handleCategorySelect(item)}
          />
        )}
        horizontal
        className="max-h-10 mt-5"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
      />

      <SectionList
        ref={sectionListRef}
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => (
          <Link href={`/product/${item.id}` as any} asChild>
            <Product data={item} />
          </Link>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-xl text-gray-800 font-bold mt-8 mb-3 px-5">
            {title}
          </Text>
        )}
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}