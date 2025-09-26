// Em src/types/product.ts
import { ImageSourcePropType } from "react-native";

export type ProductProps = {
  id: string;
  title: string;
  price: number;
  description?: string;
  cover?: ImageSourcePropType;
  thumbnail?: ImageSourcePropType;
  ingredients?: string[];
  category: string; // Garante que a categoria sempre exista
};