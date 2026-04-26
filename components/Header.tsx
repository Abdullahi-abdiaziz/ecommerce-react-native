import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, View, Text } from "react-native";
import React from "react";
import { HeaderProps } from "@/constants/types";
import { COLORS } from "@/constants";
import { Link } from "expo-router";
import * as Haptics from "expo-haptics";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const Header = ({
  title,
  showBack,
  showSearch,
  showCart,
  showMenu,
  showLogo,
  isScrolled,
  transparent,
}: HeaderProps) => {
  const insets = useSafeAreaInsets();
  const itemCount = 6; // This could come from a cart context later

  const borderClass =
    isScrolled || !transparent ? "border-b border-slate-100" : "border-b-0";

  const headerBgStyle = transparent
    ? isScrolled
      ? { backgroundColor: "rgba(255, 255, 255, 0.95)" }
      : { backgroundColor: "transparent" }
    : { backgroundColor: "#ffffff" };

  const shadowStyle = isScrolled
    ? {
        shadowColor: "#e2e8f0",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }
    : {};

  return (
    <View
      style={[{ paddingTop: insets.top + 5 }, headerBgStyle, shadowStyle]}
      className={`flex-row items-center justify-between px-4 pb-3 ${borderClass}`}
    >
      {/* LEFT SECTION */}
      <View className="flex-row items-center flex-1">
        {showBack && (
          <HeaderButton
            icon="arrow-back"
            onPress={() => {}}
            isBack
            isScrolled={isScrolled}
            transparent={transparent}
          />
        )}
        {showMenu && (
          <HeaderButton
            icon="menu-outline"
            onPress={() => {}}
            isScrolled={isScrolled}
            transparent={transparent}
          />
        )}
        {!showBack && !showMenu && <View className="w-10" />}
      </View>

      {/* CENTER SECTION */}
      <View className="flex-[3] items-center justify-center">
        {showLogo ? (
          <Logo />
        ) : (
          title && (
            <Text
              className={`text-lg font-bold ${isScrolled || !transparent ? "text-primary" : "text-primary"} tracking-tight`}
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
          <HeaderButton
            icon="search-outline"
            onPress={() => {}}
            isScrolled={isScrolled}
            transparent={transparent}
          />
        )}
        {showCart && (
          <CartButton
            itemCount={itemCount}
            onPress={() => {}}
            isScrolled={isScrolled}
            transparent={transparent}
          />
        )}
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

const HeaderButton = ({
  icon,
  onPress,
  isBack,
  isScrolled,
  transparent,
}: HeaderButtonProps & { isScrolled?: boolean; transparent?: boolean }) => {
  const iconColor = transparent && !isScrolled ? "" : COLORS.primary;
  const buttonBgStyle =
    transparent && !isScrolled
      ? { backgroundColor: "rgba(255, 255, 255, 0.2)" }
      : { backgroundColor: "#f8fafc" };

  const content = (
    <View
      style={buttonBgStyle}
      className="w-10 h-10 items-center justify-center rounded-full"
    >
      <Ionicons name={icon} size={22} color={iconColor} />
    </View>
  );

  if (isBack) {
    return (
      <Link href=".." asChild>
        <Pressable
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          })}
        >
          {content}
        </Pressable>
      </Link>
    );
  }

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.96 : 1 }],
      })}
    >
      {content}
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
  isScrolled,
  transparent,
}: {
  itemCount: number;
  onPress: () => void;
  isScrolled?: boolean;
  transparent?: boolean;
}) => {
  const iconColor = transparent && !isScrolled ? "" : COLORS.primary;
  const buttonBgStyle =
    transparent && !isScrolled
      ? { backgroundColor: "rgba(255, 255, 255, 0.2)" }
      : { backgroundColor: "#f8fafc" };

  return (
    <Link href="/(tabs)/cart" asChild>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
          buttonBgStyle,
        ]}
        className="w-10 h-10 items-center justify-center rounded-full relative"
      >
        <Ionicons name="bag-outline" size={22} color={iconColor} />
        {itemCount > 0 && (
          <View className="absolute -top-1 -right-1 bg-accent rounded-full min-w-[18px] h-[18px] px-1 items-center justify-center border-2 border-white">
            <Text className="text-white text-[10px] font-bold">
              {itemCount}
            </Text>
          </View>
        )}
      </Pressable>
    </Link>
  );
};

export default Header;
