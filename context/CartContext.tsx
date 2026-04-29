import cart from "@/app/(tabs)/cart";
import { dummyCart } from "@/assets/assets";
import { Product } from "@/constants/types";
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type CartContextType = {
  cart: CartItem[];
  loading: boolean;
  addToCart: (
    product: Product,
    quantity: number,
    size: string,
  ) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateCartQuantity: (
    itemId: string,
    quantity: number,
    size: string,
  ) => Promise<void>;
  isInCart: (itemId: string) => boolean;
  clearCart: () => Promise<void>;
  cartTotal: number;
  itemCount: number;
};

type CartItem = {
  id: string;
  productId: string;
  price: number;
  quantity: number;
  size: string;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [itemCount, setItemCount] = useState<number>(0);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = dummyCart;
      const mappedItems: CartItem[] = response.items.map((item) => ({
        id: item._id,
        productId: item.product._id,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
      }));
      setCartItems(mappedItems);
      setCartTotal(response.totalAmount);
      setItemCount(
        response.items.reduce((total, item) => total + item.quantity, 0),
      );
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (
    product: Product,
    quantity: number,
    size: string,
  ) => {};

  const removeFromCart = async (itemId: string) => {};

  const updateCartQuantity = async (
    itemId: string,
    quantity: number,
    size: string,
  ) => {};

  const isInCart = (itemId: string) => {
    return cartItems.some((item) => item.id === itemId);
  };

  const clearCart = async () => {};

  return (
    <CartContext.Provider
      value={{
        cart: cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        isInCart,
        clearCart,
        cartTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context && context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
