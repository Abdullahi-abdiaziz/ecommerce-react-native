import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { dummyProducts } from "@/assets/assets";
import { COLORS, CATEGORIES } from "@/constants";
import { Product } from "@/constants/types";
import ProductCard from "@/components/ProductCard";
import FilterModal, { FilterOptions } from "@/components/FilterModal";

export default function ProductsPage() {
  const insets = useSafeAreaInsets();
  const { category: initialCategory } = useLocalSearchParams<{
    category?: string;
  }>();

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);

  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    categories: initialCategory ? [initialCategory] : [],
    priceRange: null,
    sortBy: null,
  });

  const availableCategoryNames = CATEGORIES.map((c) => c.name);

  // Apply filters and search
  useEffect(() => {
    let result = [...dummyProducts];

    // Search Query Filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    // Categories Filter
    if (activeFilters.categories.length > 0) {
      result = result.filter((p) => {
        const pCategory =
          typeof p.category === "string" ? p.category : p.category;
        return activeFilters.categories.includes(pCategory);
      });
    }

    // Price Range Filter
    if (activeFilters.priceRange) {
      result = result.filter((p) => {
        const price = p.price;
        switch (activeFilters.priceRange) {
          case "0-50":
            return price < 50;
          case "50-100":
            return price >= 50 && price <= 100;
          case "100-200":
            return price > 100 && price <= 200;
          case "200+":
            return price > 200;
          default:
            return true;
        }
      });
    }

    // Sorting
    if (activeFilters.sortBy) {
      switch (activeFilters.sortBy) {
        case "price-asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "popular":
          // using average rating as popular metric
          result.sort(
            (a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0),
          );
          break;
        case "newest":
          // using dummy createdAt sorting
          result.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          break;
      }
    }

    setFilteredProducts(result);
    setVisibleCount(10);
  }, [searchQuery, activeFilters]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const loadMore = () => {
    if (visibleCount < filteredProducts.length) {
      setVisibleCount((prev) => prev + 10);
    }
  };

  const activeFiltersCount =
    activeFilters.categories.length +
    (activeFilters.priceRange ? 1 : 0) +
    (activeFilters.sortBy ? 1 : 0);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="px-4 py-3 flex-row items-center border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center bg-slate-50 mr-3"
        >
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Search Bar */}
        <View className="flex-1 flex-row items-center bg-slate-50 rounded-full px-4 h-11 mr-3">
          <Ionicons name="search" size={20} color={COLORS.secondary} />
          <TextInput
            placeholder="Search products..."
            className="flex-1 ml-2 font-medium text-primary"
            placeholderTextColor={COLORS.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={COLORS.secondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Button */}
        <TouchableOpacity
          onPress={() => setFilterModalVisible(true)}
          className="w-11 h-11 rounded-full items-center justify-center bg-slate-50 relative"
        >
          <Ionicons name="options-outline" size={22} color={COLORS.primary} />
          {activeFiltersCount > 0 && (
            <View className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary items-center justify-center border-2 border-white">
              <Text className="text-[9px] font-bold text-white">
                {activeFiltersCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayedProducts}
        keyExtractor={(item) => item._id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 100,
        }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 16,
        }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View className="mb-4 flex-row justify-between items-end">
            <Text className="text-2xl font-black text-primary">
              All Products
            </Text>
            <Text className="text-secondary font-medium">
              {filteredProducts.length} items
            </Text>
          </View>
        }
        renderItem={({ item }) => <ProductCard product={item} />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center mt-20">
            <View className="w-24 h-24 rounded-full bg-slate-50 items-center justify-center mb-4">
              <Ionicons
                name="search-outline"
                size={40}
                color={COLORS.secondary}
              />
            </View>
            <Text className="text-xl font-bold text-primary mb-2">
              No products found
            </Text>
            <Text className="text-secondary text-center max-w-[250px] mb-6">
              Try adjusting your search or filters to find what you're looking
              for.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                setActiveFilters({
                  categories: [],
                  priceRange: null,
                  sortBy: null,
                });
              }}
              className="bg-primary px-6 py-3 rounded-full"
            >
              <Text className="text-white font-bold">Clear All Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Filter Modal */}
      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={(filters) => setActiveFilters(filters)}
        availableCategories={availableCategoryNames}
        initialFilters={activeFilters}
      />
    </View>
  );
}
