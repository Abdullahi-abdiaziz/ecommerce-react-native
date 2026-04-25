import { ScrollView, View, Image, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import Header from "@/components/Header";
import { BANNERS } from "@/assets/assets";
import { Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { CATEGORIES, COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header showMenu showCart showLogo />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="flex-1 px-4"
      >
        <BannerSection />
        <CategorySection />
        {/* <FeaturedProductsSection /> */}
        {/* <FlashSaleSection /> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const BannerSection = () => {
  const router = useRouter();
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  return (
    <>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const index = Math.round(offsetX / width);
          setActiveBannerIndex(index);
        }}
        scrollEventThrottle={16}
        className="w-full h-48 rounded-xl mt-4 scroll-smooth"
      >
        {BANNERS.map((banner, index) => (
          <View
            key={index}
            className="relative w-full h-48 bg-gray-200 overflow-hidden"
            style={{ width: width - 28 }}
          >
            <Image
              source={{ uri: banner.image }}
              resizeMode="cover"
              className="rounded-xl w-full h-full"
            />
            <View className="absolute bottom-4 left-4 z-10">
              <Text className="text-white text-2xl font-bold">
                {banner.title}
              </Text>
              <Text className="text-white text-sm font-medium">
                {banner.subtitle}
              </Text>
              <TouchableOpacity
                className="mt-2 bg-white px-4 py-2 rounded-full self-start"
                onPress={() => {
                  router.push("/");
                }}
              >
                <Text className="text-primary font-bold text-sm">Get Now</Text>
              </TouchableOpacity>
            </View>
            <View className="absolute inset-0 bg-black/40 rounded-xl" />
          </View>
        ))}
      </ScrollView>

      {/* PaginationDots */}
      <View className="flex-row justify-center mt-2.5">
        {BANNERS.map((_, index) => (
          <View
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${
              index === activeBannerIndex ? " w-5 bg-accent" : "bg-gray-300"
            }`}
          />
        ))}
      </View>
    </>
  );
};

const CategorySection = () => {
  const categories = [{ id: "all", name: "All", icon: "grid" }, ...CATEGORIES];
  const [activeCategory, setActiveCategory] = useState("all");
  return (
    <View className="mt-6">
      <View className="flex flex-col">
        <Text className="text-lg font-extrabold text-primary mb-3 uppercase leading-none tracking-tighter">
          Categories
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className=""
        >
          {categories.map((category: any) => (
            <TouchableOpacity
              key={category.id}
              className={`bg-gray-50 p-3 w-20 rounded-xl mr-2 ${
                activeCategory === category.id
                  ? "border-accent/50 border-2"
                  : "border-transparent border-2"
              }`}
              onPress={() => {
                setActiveCategory(category.id);
              }}
            >
              <View className="items-center justify-center">
                <Ionicons
                  name={category.icon}
                  size={24}
                  color={
                    activeCategory === category.id
                      ? COLORS.accent
                      : COLORS.primary
                  }
                />
                <Text
                  className={`text-sm font-bold ${
                    activeCategory === category.id
                      ? "text-accent"
                      : "text-black"
                  }`}
                >
                  {category.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};
