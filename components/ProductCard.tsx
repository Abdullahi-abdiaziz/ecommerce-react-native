import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "@/constants";
import { Product } from "@/constants/types";
import { useWishlist } from "@/context/WishListContext";

const { width } = Dimensions.get("window");

export default function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isSale = product.comparePrice && product.comparePrice > product.price;

  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/products/${product._id}`);
      }}
      activeOpacity={0.8}
      className="bg-white rounded-[10px] border border-gray-100 overflow-hidden"
      style={{
        width: (width - 48) / 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View className="relative">
        <Image
          source={{ uri: product.images[0] }}
          className="w-full aspect-[4/5]"
          resizeMode="cover"
        />

        {/* Action Buttons Overlay */}
        <View className="absolute top-3 right-3 gap-2">
          <TouchableOpacity
            className="p-2 rounded-full"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Ionicons
              name={isInWishlist(product._id) ? "heart" : "heart-outline"}
              size={18}
              color={isInWishlist(product._id) ? COLORS.error : COLORS.primary}
              onPress={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
              }}
            />
          </TouchableOpacity>
        </View>

        {/* Badges */}
        {isSale && (
          <View
            className="absolute top-3 left-3 px-3 py-1 rounded-full"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.9)",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Text className="text-white text-[10px] font-black uppercase tracking-wider">
              Sale
            </Text>
          </View>
        )}

        {/* Rating Floating Badge */}
        <View
          className="absolute bottom-3 left-3 px-2.5 py-1.5 rounded-lg flex-row items-center gap-1 border border-slate-50"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text className="text-primary text-[11px] font-bold">
            {product.ratings?.average || "0.0"}
          </Text>
        </View>
      </View>

      <View className="p-2">
        <Text className="text-secondary text-[10px] font-bold uppercase tracking-[1px] mb-1">
          {typeof product.category === "string"
            ? product.category
            : product.category?.name || "Other"}
        </Text>
        <Text
          className="text-primary font-bold text-[15px] leading-tight h-8"
          numberOfLines={1}
        >
          {product.name}
        </Text>

        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-accent font-black text-lg">
              ${product.price}
            </Text>
            {isSale && (
              <Text className="text-secondary text-[10px] line-through font-medium">
                ${product.comparePrice}
              </Text>
            )}
          </View>

          <TouchableOpacity
            className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center"
            onPress={(e) => {
              e.stopPropagation();
              // Add to cart logic
            }}
          >
            <Ionicons name="add" size={15} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
