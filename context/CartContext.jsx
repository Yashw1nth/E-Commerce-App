import React, { createContext, useReducer, useContext } from "react";

const CartContext = createContext();

const initialState = {
  cartItems: [],
  favourites: [],       // ✅ new
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const exists = state.cartItems.find(i => i.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          cartItems: state.cartItems.map(i =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return {
        ...state,
        cartItems: [...state.cartItems, { ...action.payload, qty: 1 }],
      };
    }

    // ✅ ADD TO FAV
    case "ADD_TO_FAV": {
      const exists = state.favourites.find(i => i.id === action.payload.id);
      if (exists) return state; // avoid duplicates
      return { ...state, favourites: [...state.favourites, action.payload] };
    }

    // ✅ REMOVE FROM FAV
    case "REMOVE_FROM_FAV":
      return {
        ...state,
        favourites: state.favourites.filter(i => i.id !== action.payload.id),
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter(i => i.id !== action.payload.id),
      };

    case "UPDATE_QTY":
      return {
        ...state,
        cartItems: state.cartItems.map(i =>
          i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i
        ),
      };

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
