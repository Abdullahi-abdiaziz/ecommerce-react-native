import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { dummyProducts } from "@/assets/assets";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Product } from "@/constants/types";
import { useWishlist } from "@/context/WishListContext";

const { width } = Dimensions.get("window");

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Simulate API fetch
    const fetchProduct = () => {
      const foundProduct = dummyProducts.find((p) => p._id === id);
      if (foundProduct) {
        setProduct(foundProduct as Product);
        if (foundProduct.sizes && foundProduct.sizes.length > 0) {
          setSelectedSize(foundProduct.sizes[0]);
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-xl font-bold text-primary">
          Product not found
        </Text>
        <TouchableOpacity
          className="mt-4 px-6 py-3 bg-primary rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isSale = product.comparePrice && product.comparePrice > product.price;

  return (
    <View className="flex-1 bg-white">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Floating Header */}
      <View
        className="absolute top-0 left-0 right-0 z-50 flex-row justify-between items-center px-4"
        style={{ paddingTop: insets.top + 10 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleWishlist(product)}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
        >
          <Ionicons
            name={isInWishlist(product._id) ? "heart" : "heart-outline"}
            size={22}
            color={isInWishlist(product._id) ? COLORS.error : COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Image Carousel */}
        <View className="relative w-full" style={{ height: width * 1.25 }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const offsetX = e.nativeEvent.contentOffset.x;
              const index = Math.round(offsetX / width);
              setActiveImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {product.images.map((img: string, index: number) => (
              <Image
                key={index}
                source={{ uri: img }}
                className="w-full h-full"
                resizeMode="cover"
                style={{ width }}
              />
            ))}
          </ScrollView>

          {/* Pagination Dots */}
          <View className="absolute bottom-10 left-0 right-0 flex-row justify-center space-x-2">
            {product.images.map((_: any, index: number) => (
              <View
                key={index}
                className={`h-2 rounded-full ${
                  index === activeImageIndex
                    ? "w-6 bg-primary"
                    : "w-2 bg-white/60"
                }`}
              />
            ))}
          </View>
        </View>

        {/* Details Bottom Sheet Style Container */}
        <View
          className="bg-white rounded-t-[32px] px-5 pt-8 pb-32 -mt-8"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 10,
          }}
        >
          {/* Title & Price Header */}
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 pr-4">
              <Text className="text-secondary text-sm font-bold uppercase tracking-wider mb-2">
                {typeof product.category === "string"
                  ? product.category
                  : product.category.name}
              </Text>
              <Text className="text-2xl font-extrabold text-primary leading-tight">
                {product.name}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-black text-accent">
                ${product.price}
              </Text>
              {isSale && (
                <Text className="text-sm font-semibold text-secondary line-through">
                  ${product.comparePrice}
                </Text>
              )}
            </View>
          </View>

          {/* Rating */}
          <View className="flex-row items-center space-x-2 mb-6">
            <View className="flex-row items-center space-x-1 bg-amber-50 px-2 py-1 rounded-md">
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text className="text-amber-600 font-bold">
                {product.ratings?.average || "0.0"}
              </Text>
            </View>
            <Text className="text-secondary font-medium">
              ({product.ratings?.count || 0} reviews)
            </Text>
          </View>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <View className="mb-8">
              <Text className="text-lg font-bold text-primary mb-3">
                Select Size
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {product.sizes.map((size: string, index: number) => {
                  const isSelected = selectedSize === size;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedSize(size)}
                      className={`mr-3 w-14 h-14 rounded-full items-center justify-center border-2 ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <Text
                        className={`font-bold text-base ${
                          isSelected ? "text-white" : "text-primary"
                        }`}
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Description */}
          <View className="mb-8">
            <Text className="text-lg font-bold text-primary mb-3">
              Description
            </Text>
            <Text className="text-secondary leading-relaxed text-[15px]">
              {product.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white pt-4 px-5 border-t border-gray-100"
        style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center bg-gray-100 rounded-full px-2 py-1">
            <TouchableOpacity
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
            >
              <Ionicons name="remove" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <Text className="font-bold text-lg px-4 text-primary">
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
            >
              <Ionicons name="add" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="flex-1 ml-6 bg-primary h-14 rounded-full flex-row items-center justify-center shadow-md">
            <Ionicons
              name="cart-outline"
              size={22}
              color="white"
              className="mr-2"
            />
            <Text className="text-white font-bold text-lg ml-2">
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
