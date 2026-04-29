import { dummyWishlist } from "@/assets/assets";
import { Product, WishlistContextType } from "@/constants/types";
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";

const WishListContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export const WishListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      setWishlist(dummyWishlist);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (product: Product) => {
    const exists = wishlist.find((p) => p._id === product._id);
    if (exists) {
      setWishlist(wishlist.filter((p) => p._id !== product._id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p._id === productId);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishListContext.Provider
      value={{ wishlist, loading, isInWishlist, toggleWishlist }}
    >
      {children}
    </WishListContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishListContext);
  if (!context && context === undefined) {
    throw new Error("useWishlist must be used within a WishListProvider");
  }
  return context;
};
