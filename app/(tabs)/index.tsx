import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import Header from "@/components/Header";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header showMenu showSearch showCart showLogo />
    </SafeAreaView>
  );
}
