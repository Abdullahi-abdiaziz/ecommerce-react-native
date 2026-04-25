import { ScrollView, View, Image, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import Header from "@/components/Header";
import { BANNERS } from "@/assets/assets";
import { Dimensions } from "react-native";

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
        {/* <CategorySection /> */}
        {/* <FeaturedProductsSection /> */}
        {/* <FlashSaleSection /> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const BannerSection = () => {
  return (
    <ScrollView
      pagingEnabled
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      className="w-full h-48 rounded-xl mt-4"
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
            <TouchableOpacity className="mt-2 bg-white px-4 py-2 rounded-full self-start">
              <Text className="text-primary font-bold text-sm">Get Now</Text>
            </TouchableOpacity>
          </View>
          <View className="absolute inset-0 bg-black/40" />
        </View>
      ))}
    </ScrollView>
  );
};
