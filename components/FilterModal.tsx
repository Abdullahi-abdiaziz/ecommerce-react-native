import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";

const { height } = Dimensions.get("window");

export interface FilterOptions {
  categories: string[];
  priceRange: string | null;
  sortBy: string | null;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  availableCategories: string[];
  initialFilters?: FilterOptions;
}

const PRICE_RANGES = [
  { id: "0-50", label: "Under $50" },
  { id: "50-100", label: "$50 - $100" },
  { id: "100-200", label: "$100 - $200" },
  { id: "200+", label: "Over $200" },
];

const SORT_OPTIONS = [
  { id: "popular", label: "Most Popular" },
  { id: "newest", label: "Newest Arrivals" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
];

export default function FilterModal({
  visible,
  onClose,
  onApply,
  availableCategories,
  initialFilters,
}: FilterModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters?.categories || [],
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    initialFilters?.priceRange || null,
  );
  const [sortBy, setSortBy] = useState<string | null>(
    initialFilters?.sortBy || null,
  );

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedPriceRange(null);
    setSortBy(null);
  };

  const handleApply = () => {
    onApply({
      categories: selectedCategories,
      priceRange: selectedPriceRange,
      sortBy: sortBy,
    });
    onClose();
  };

  const activeFiltersCount =
    selectedCategories.length + (selectedPriceRange ? 1 : 0) + (sortBy ? 1 : 0);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      style={{ maxHeight: height }}
    >
      <View className="flex-1 justify-end bg-black/50">
        <TouchableOpacity
          className="absolute inset-0 bottom-0"
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          className="bg-white rounded-t-3xl overflow-hidden"
          style={{ maxHeight: height }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-5 border-b border-gray-100">
            <Text className="text-xl font-bold text-primary">Filters</Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
            >
              <Ionicons name="close" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="px-5 py-2"
            showsVerticalScrollIndicator={false}
          >
            {/* Sort By */}
            <View className="py-4">
              <Text className="text-lg font-bold text-primary mb-4">
                Sort By
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {SORT_OPTIONS.map((option) => {
                  const isSelected = sortBy === option.id;
                  return (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => setSortBy(option.id)}
                      className={`px-4 py-2.5 rounded-full border ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          isSelected ? "text-white" : "text-secondary"
                        }`}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Categories */}
            <View className="py-4">
              <Text className="text-lg font-bold text-primary mb-4">
                Categories
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {availableCategories.map((category, index) => {
                  const isSelected = selectedCategories.includes(category);
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => toggleCategory(category)}
                      className={`px-4 py-2.5 rounded-full border ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          isSelected ? "text-white" : "text-secondary"
                        }`}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Price Range */}
            <View className="py-4 mb-24">
              <Text className="text-lg font-bold text-primary mb-4">
                Price Range
              </Text>
              <View className="flex-row flex-wrap justify-between gap-y-3">
                {PRICE_RANGES.map((range) => {
                  const isSelected = selectedPriceRange === range.id;
                  return (
                    <TouchableOpacity
                      key={range.id}
                      onPress={() =>
                        setSelectedPriceRange(isSelected ? null : range.id)
                      }
                      className={`w-[48%] py-3 rounded-xl border items-center justify-center ${
                        isSelected
                          ? "bg-primary border-primary"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <Text
                        className={`font-semibold ${
                          isSelected ? "text-white" : "text-secondary"
                        }`}
                      >
                        {range.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Sticky Footer */}
          <View className="absolute bottom-0 left-0 right-0 bg-white p-5 border-t border-gray-100 flex-row items-center justify-between pb-8">
            <TouchableOpacity onPress={handleReset} className="py-3 px-6">
              <Text className="text-secondary font-bold text-base">Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              className="bg-primary py-4 px-8 rounded-full flex-1 ml-4 items-center flex-row justify-center shadow-sm"
            >
              <Text className="text-white font-bold text-base mr-2">
                Apply Filters
              </Text>
              {activeFiltersCount > 0 && (
                <View className="bg-white px-2 py-0.5 rounded-full">
                  <Text className="text-primary text-xs font-black">
                    {activeFiltersCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
