"use client";
import { CartItem } from "@/lib/types/data";

export function pushCartItem(newItem: CartItem) {
  const cartItems = JSON.parse(
    window.localStorage.getItem("cartItems") ?? "[]",
  ) as CartItem[];
  cartItems.push(newItem);
  updateCartItems(cartItems);
}

export function updateCartItems(newItems: CartItem[]) {
  window.localStorage.setItem("cartItems", JSON.stringify(newItems));
  window.dispatchEvent(new CustomEvent("cart-items-updated"));
}
