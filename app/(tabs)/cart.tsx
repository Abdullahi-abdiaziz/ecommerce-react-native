import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import CartItem from "@/components/CartItem";
import { dummyProducts } from "@/assets/assets";
import { COLORS } from "@/constants";
import * as Haptics from "expo-haptics";

// Initial mock state
const initialCartItems = [
  { id: "1", product: dummyProducts[0], quantity: 1, size: "M" },
  { id: "2", product: dummyProducts[1], quantity: 2, size: "L" },
  { id: "3", product: dummyProducts[2], quantity: 1, size: "9" },
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleUpdateQuantity = (id: string, newQty: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item,
      ),
    );
  };

  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? 15 : 0; // Flat shipping rate
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Proceed to checkout logic
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center p-6 mt-20">
      <View className="w-32 h-32 rounded-full bg-slate-50 items-center justify-center mb-6">
        <Ionicons name="cart-outline" size={64} color={COLORS.secondary} />
      </View>
      <Text className="text-2xl font-black text-primary mb-2">
        Your Cart is Empty
      </Text>
      <Text className="text-secondary text-center mb-8">
        Looks like you haven't added anything to your cart yet.
      </Text>
      <TouchableOpacity
        className="bg-primary px-8 py-4 rounded-full shadow-sm"
        onPress={() => router.push("/")}
      >
        <Text className="text-white font-bold text-lg">Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrderSummary = () => {
    if (cartItems.length === 0) return null;
    return (
      <View className="bg-slate-50 rounded-3xl p-5 mt-4 mx-4 mb-8 shadow-sm border border-slate-100">
        <Text className="text-lg font-black text-primary mb-4">
          Order Summary
        </Text>
        <View className="space-y-3 gap-y-3">
          <View className="flex-row justify-between">
            <Text className="text-secondary font-medium">Subtotal</Text>
            <Text className="font-bold text-primary">
              ${subtotal.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-secondary font-medium">Shipping</Text>
            <Text className="font-bold text-primary">
              ${shipping.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row justify-between pb-3 border-b border-slate-200">
            <Text className="text-secondary font-medium">Tax</Text>
            <Text className="font-bold text-primary">${tax.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between pt-1">
            <Text className="text-xl font-black text-primary">Total</Text>
            <Text className="text-xl font-black text-primary">
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
          }}
        >
          <Header title="My Cart" showBack />
        </View>
        <View className="pt-20">
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CartItem
                item={item}
                onRemove={() => handleRemove(item.id)}
                onUpdateQuantity={(newQty) =>
                  handleUpdateQuantity(item.id, newQty)
                }
              />
            )}
            contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
            ListFooterComponent={renderOrderSummary}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />
          {cartItems.length > 0 && (
            <View className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-slate-100 shadow-2xl pt-4 pb-8 rounded-t-3xl">
              <TouchableOpacity
                onPress={handleCheckout}
                className="bg-primary py-4 rounded-full items-center flex-row justify-between px-6 shadow-md"
              >
                <Text className="text-white font-black text-lg">Checkout</Text>
                <View className="bg-white/20 px-3 py-1.5 rounded-full">
                  <Text className="text-white font-black">
                    ${total.toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
