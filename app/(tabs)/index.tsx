import {
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { BANNERS, dummyProducts } from "@/assets/assets";
import { router } from "expo-router";
import { CATEGORIES, COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "@/constants/types";

const { width } = Dimensions.get("window");

export default function Home() {
  const scrollY = useSharedValue(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const insets = useSafeAreaInsets();

  const handleScrollState = (offset: number) => {
    if (offset > 20 && !isScrolled) {
      setIsScrolled(true);
    } else if (offset <= 20 && isScrolled) {
      setIsScrolled(false);
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      runOnJS(handleScrollState)(event.contentOffset.y);
    },
  });

  return (
    <View className="flex-1 bg-white">
      {/* Floating Header */}
      <View
        style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50 }}
      >
        <Header
          showMenu
          showCart
          showLogo
          isScrolled={isScrolled}
          transparent
          showSearch
        />
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4"
        contentContainerStyle={{
          paddingTop: insets.top + 60,
          paddingBottom: 20,
        }}
      >
        <BannerSection />
        <CategorySection />
        <ProductShowcaseSection />
        {/* <FeaturedProductsSection /> */}
        {/* <FlashSaleSection /> */}
      </Animated.ScrollView>
    </View>
  );
}

const BannerSection = () => {
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
            <View
              className="absolute inset-0 rounded-xl"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
            />
          </View>
        ))}
      </ScrollView>

      {/* PaginationDots */}
      <View className="flex-row justify-center mt-4">
        {BANNERS.map((_, index) => (
          <View
            key={index}
            className={`h-1.5 rounded-full mx-1 ${
              index === activeBannerIndex
                ? "w-6 bg-accent"
                : "w-1.5 bg-slate-200"
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
    <View className="mt-8">
      <View className="flex flex-col">
        <HeadingTitle title="Categories" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {categories.map((category: any) => (
            <TouchableOpacity
              key={category.id}
              className={`p-3 w-24 h-24 rounded-lg mr-3 items-center justify-center ${
                activeCategory === category.id ? "bg-accent/80" : "bg-slate-50"
              }`}
              onPress={() => {
                setActiveCategory(category.id);
              }}
            >
              <View className="items-center justify-center">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mb-2"
                  style={{
                    backgroundColor:
                      activeCategory === category.id
                        ? "rgba(255, 255, 255, 0.2)"
                        : "#ffffff",
                  }}
                >
                  <Ionicons
                    name={category.icon}
                    size={24}
                    color={
                      activeCategory === category.id ? "white" : COLORS.primary
                    }
                  />
                </View>
                <Text
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    activeCategory === category.id
                      ? "text-white"
                      : "text-slate-600"
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
        <TouchableOpacity
          onPress={() => {
            router.push("/products");
          }}
        >
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
    <View className="flex flex-row items-center justify-start gap-3 mb-1">
      <View className="w-1.5 h-6 bg-accent rounded-full" />
      <Text className="text-xl font-bold text-primary tracking-tight">
        {title}
      </Text>
    </View>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
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
            <Ionicons name="heart-outline" size={18} color={COLORS.primary} />
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
            {product.ratings.average}
          </Text>
        </View>
      </View>

      <View className="p-2">
        <Text className="text-secondary text-[10px] font-bold uppercase tracking-[1px] mb-1">
          {typeof product.category === "string"
            ? product.category
            : product.category.name}
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
};
