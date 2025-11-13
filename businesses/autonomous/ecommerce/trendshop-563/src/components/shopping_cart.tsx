// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  // Optional:  Callback function to update the parent component with cart changes
  onCartUpdate?: (cart: CartItem[]) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ onCartUpdate }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading cart data from local storage or an API
    setLoading(true);
    try {
      const storedCart = localStorage.getItem('shoppingCart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (e: any) {
      console.error("Error loading cart from local storage:", e);
      setError("Failed to load cart data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Save cart to local storage whenever it changes
    try {
      localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
      if (onCartUpdate) {
        onCartUpdate(cartItems); // Notify parent component
      }
    } catch (e: any) {
      console.error("Error saving cart to local storage:", e);
      setError("Failed to save cart data.");
    }
  }, [cartItems, onCartUpdate]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        setCartItems(
          cartItems.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
          )
        );
      } else {
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
      setError(null); // Clear any previous errors
    } catch (e: any) {
      console.error("Error adding item to cart:", e);
      setError("Failed to add item to cart.");
    }
  };

  const removeItem = (itemId: string) => {
    try {
      setCartItems(cartItems.filter((item) => item.id !== itemId));
      setError(null); // Clear any previous errors
    } catch (e: any) {
      console.error("Error removing item from cart:", e);
      setError("Failed to remove item from cart.");
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 0) {
      console.warn("Quantity cannot be negative.  Setting to 0.");
      quantity = 0; // Prevent negative quantities
    }
    try {
      setCartItems(
        cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: quantity } : item
        )
      );
      setError(null); // Clear any previous errors
    } catch (e: any) {
      console.error("Error updating quantity:", e);
      setError("Failed to update quantity.");
    }
  };

  const calculateTotal = (): number => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price} x {item.quantity} = ${item.price * item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${calculateTotal()}</p>
    </div>
  );
};

export default ShoppingCart;