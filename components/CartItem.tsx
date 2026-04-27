import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import * as Haptics from "expo-haptics";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { CartItemProps } from "@/constants/types";

export default function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
}: CartItemProps) {
  const { product, quantity, size } = item;

  const handleIncrease = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onUpdateQuantity) onUpdateQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (quantity > 1) {
      if (onUpdateQuantity) onUpdateQuantity(quantity - 1);
    }
  };

  const handleRemove = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (onRemove) onRemove();
  };

  const renderRightActions = () => {
    return (
      <TouchableOpacity
        onPress={handleRemove}
        className="w-20 bg-red-500 items-center justify-center rounded-r-2xl my-2 ml-2"
      >
        <Ionicons name="trash-outline" size={24} color="#FFF" />
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <View className="flex-row bg-white rounded-2xl p-3 my-2 mx-4 shadow-sm border border-slate-100">
        {/* Product Image */}
        <Image
          source={{ uri: product.images[0] }}
          className="w-24 h-24 rounded-xl"
          resizeMode="cover"
        />

        {/* Product Details */}
        <View className="flex-1 ml-4 justify-between">
          <View>
            <Text
              className="text-primary font-bold text-base"
              numberOfLines={2}
            >
              {product.name}
            </Text>
            {size ? (
              <Text className="text-secondary text-sm mt-1">Size: {size}</Text>
            ) : null}
          </View>

          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-primary font-bold text-lg">
              ${product.price.toFixed(2)}
            </Text>

            {/* Quantity Controls */}
            <View className="flex-row items-center bg-slate-50 rounded-full px-2 py-1 border border-slate-100">
              <TouchableOpacity
                onPress={handleDecrease}
                className="w-8 h-8 items-center justify-center rounded-full bg-white shadow-sm"
                disabled={quantity <= 1}
              >
                <Ionicons
                  name="remove"
                  size={16}
                  color={quantity <= 1 ? COLORS.secondary : COLORS.primary}
                />
              </TouchableOpacity>

              <Text className="text-primary font-bold mx-3 w-4 text-center">
                {quantity}
              </Text>

              <TouchableOpacity
                onPress={handleIncrease}
                className="w-8 h-8 items-center justify-center rounded-full bg-primary shadow-sm"
              >
                <Ionicons name="add" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Swipeable>
  );
}
