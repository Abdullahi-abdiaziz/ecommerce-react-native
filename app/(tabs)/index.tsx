import {
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { BANNERS, dummyProducts } from "@/assets/assets";
import { Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { CATEGORIES, COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "@/constants/types";

const { width } = Dimensions.get("window");

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header showMenu showCart showLogo />
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
        <BannerSection />
        <CategorySection />
        <ProductShowcaseSection />
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
        {/* <Text className="text-lg font-extrabold text-primary mb-3 uppercase leading-none tracking-tighter">
          Categories
        </Text> */}
        <HeadingTitle title="Categories" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
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

const ProductShowcaseSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setProducts(dummyProducts);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <View className="mt-6">
      <View className="flex flex-row items-center justify-between mb-3">
        {/* <Text className="text-lg font-extrabold text-primary uppercase leading-none tracking-tighter">
          Popular
        </Text> */}
        <HeadingTitle title="Popular" />
        <TouchableOpacity onPress={() => {}}>
          <Text className="text-sm font-bold  text-secondary">See All</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          className="mt-10"
        />
      ) : (
        <View className="flex flex-row flex-wrap justify-between gap-y-4">
          {products.slice(0, 6).map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </View>
      )}
    </View>
  );
};

const HeadingTitle = ({ title }: { title: string }) => {
  return (
    <View className="flex flex-row items-center justify-start gap-2 rounded-md overflow-hidden">
      <View className="w-2 h-5 bg-accent"></View>
      <Text className="text-lg font-extrabold text-primary uppercase leading-none tracking-tighter">
        {title}
      </Text>
    </View>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter();
  const isSale = product.comparePrice && product.comparePrice > product.price;

  return (
    <TouchableOpacity
      onPress={() => {
        // router.push(`/(tabs)/products/${product._id}`);
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
            className="bg-white/90 p-2 rounded-full shadow-sm"
            style={{ backdropFilter: "blur(10px)" }}
          >
            <Ionicons name="heart-outline" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Badges */}
        {isSale && (
          <View className="absolute top-3 left-3 bg-error px-2.5 py-1 rounded-full">
            <Text className="text-white text-[10px] font-black uppercase">
              Sale
            </Text>
          </View>
        )}

        {/* Rating Floating Badge */}
        <View className="absolute bottom-3 left-3 bg-white/90 px-2.5 py-1 rounded-xl flex-row items-center gap-1 shadow-sm">
          <Ionicons name="star" size={12} color="#FFD700" />
          <Text className="text-primary text-[11px] font-bold">
            {product.ratings.average}
          </Text>
        </View>
      </View>

      <View className="p-4 pt-3">
        <Text className="text-secondary text-[10px] font-bold uppercase tracking-[1px] mb-1">
          {typeof product.category === "string"
            ? product.category
            : product.category.name}
        </Text>
        <Text
          className="text-primary font-bold text-[15px] leading-tight h-10"
          numberOfLines={2}
        >
          {product.name}
        </Text>

        <View className="flex-row items-center justify-between mt-1">
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
};
