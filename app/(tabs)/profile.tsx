import React from "react";
import { Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";

export default function Profile() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="My Profile" />
      <View className="flex-1 items-center justify-center">
        <Text className="text-primary">Profile</Text>
      </View>
    </SafeAreaView>
  );
}
