"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { CartItem, CartSelection } from "@/src/types";

interface CartState {
  items: CartItem[];
  open: boolean;
}

type CartAction =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; item: CartItem }
  | { type: "remove"; id: string }
  | { type: "updateQuantity"; id: string; quantity: number }
  | { type: "clear" }
  | { type: "open" }
  | { type: "close" };

interface AddCartItemInput {
  id: string;
  productId: string;
  name: string;
  unitPrice: number;
  image: string;
  quantity?: number;
  selections?: CartSelection[];
}

interface CartContextValue extends CartState {
  itemCount: number;
  subtotal: number;
  addItem: (input: AddCartItemInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const STORAGE_KEY = "shopsathi-v1-cart";

const CartContext = createContext<CartContextValue | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { ...state, items: action.items };
    case "add": {
      const existing = state.items.find((item) => item.id === action.item.id);
      if (!existing) {
        return { ...state, items: [...state.items, action.item], open: true };
      }

      return {
        ...state,
        open: true,
        items: state.items.map((item) =>
          item.id === action.item.id
            ? { ...item, quantity: item.quantity + action.item.quantity }
            : item,
        ),
      };
    }
    case "remove":
      return { ...state, items: state.items.filter((item) => item.id !== action.id) };
    case "updateQuantity":
      return {
        ...state,
        items:
          action.quantity <= 0
            ? state.items.filter((item) => item.id !== action.id)
            : state.items.map((item) =>
                item.id === action.id ? { ...item, quantity: action.quantity } : item,
              ),
      };
    case "clear":
      return { ...state, items: [] };
    case "open":
      return { ...state, open: true };
    case "close":
      return { ...state, open: false };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], open: false });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartItem[];
      dispatch({ type: "hydrate", items: Array.isArray(parsed) ? parsed : [] });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  const addItem = useCallback((input: AddCartItemInput) => {
    dispatch({
      type: "add",
      item: {
        id: input.id,
        productId: input.productId,
        name: input.name,
        unitPrice: input.unitPrice,
        image: input.image,
        quantity: input.quantity ?? 1,
        selections: input.selections ?? [],
      },
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "remove", id });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "updateQuantity", id, quantity });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: "clear" });
  }, []);

  const openCart = useCallback(() => {
    dispatch({ type: "open" });
  }, []);

  const closeCart = useCallback(() => {
    dispatch({ type: "close" });
  }, []);

  const itemCount = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items],
  );

  const subtotal = useMemo(
    () => state.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [state.items],
  );

  const value: CartContextValue = {
    ...state,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
