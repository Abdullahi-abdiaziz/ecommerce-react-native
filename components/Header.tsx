import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, View, Text } from "react-native";
import React from "react";
import { HeaderProps } from "@/constants/types";
import { COLORS } from "@/constants";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

const Header = ({
  title,
  showBack,
  showSearch,
  showCart,
  showMenu,
  showLogo,
}: HeaderProps) => {
  const itemCount = 6; // This could come from a cart context later

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
      {/* LEFT SECTION */}
      <View className="flex-row items-center flex-1">
        {showBack && (
          <HeaderButton icon="arrow-back" onPress={() => {}} isBack />
        )}
        {showMenu && <HeaderButton icon="menu-outline" onPress={() => {}} />}
        {!showBack && !showMenu && <View className="w-10" />}
      </View>

      {/* CENTER SECTION */}
      <View className="flex-[3] items-center justify-center">
        {showLogo ? (
          <Logo />
        ) : (
          title && (
            <Text
              className="text-lg font-bold text-primary tracking-tight"
              numberOfLines={1}
            >
              {title}
            </Text>
          )
        )}
      </View>

      {/* RIGHT SECTION */}
      <View className="flex-row items-center justify-end flex-1 gap-3">
        {showSearch && (
          <HeaderButton icon="search-outline" onPress={() => {}} />
        )}
        {showCart && <CartButton itemCount={itemCount} onPress={() => {}} />}
        {!showSearch && !showCart && <View className="w-10" />}
      </View>
    </View>
  );
};

interface HeaderButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  isBack?: boolean;
}

const HeaderButton = ({ icon, onPress, isBack }: HeaderButtonProps) => {
  const router = useRouter();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isBack) {
      router.back();
    } else {
      onPress();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.96 : 1 }],
      })}
      className="w-10 h-10 items-center justify-center rounded-full bg-slate-50"
    >
      <Ionicons name={icon} size={22} color={COLORS.primary} />
    </Pressable>
  );
};

const Logo = () => {
  return (
    <Image
      source={require("@/assets/logo.png")}
      style={{ width: 100, height: 24 }}
      resizeMode="contain"
    />
  );
};

const CartButton = ({
  itemCount,
  onPress,
}: {
  itemCount: number;
  onPress: () => void;
}) => {
  const router = useRouter();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(tabs)/cart");
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.96 : 1 }],
      })}
      className="w-10 h-10 items-center justify-center rounded-full bg-slate-50 relative"
    >
      <Ionicons name="bag-outline" size={22} color={COLORS.primary} />
      {itemCount > 0 && (
        <View className="absolute -top-1 -right-1 bg-accent rounded-full min-w-[18px] h-[18px] px-1 items-center justify-center border-2 border-white">
          <Text className="text-white text-[10px] font-bold">{itemCount}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default Header;
