import React from "react";
import { Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";

export default function Cart() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View
        style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50 }}
      >
        <Header title="My Cart" showBack transparent />
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-primary">Cart</Text>
      </View>
    </SafeAreaView>
  );
}
