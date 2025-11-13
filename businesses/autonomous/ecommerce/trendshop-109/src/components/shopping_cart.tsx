// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  // Optional:  If you want to pass initial cart items
  initialCartItems?: CartItem[];
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ initialCartItems }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems || []);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Recalculate total whenever cartItems change
    const newTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [cartItems]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      setLoading(true);
      // Simulate API call to check inventory
      setTimeout(() => {
        // Simulate success
        const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

        if (existingItemIndex !== -1) {
          // Item already in cart, update quantity
          const updatedCartItems = [...cartItems];
          updatedCartItems[existingItemIndex].quantity += 1;
          setCartItems(updatedCartItems);
        } else {
          // Item not in cart, add it
          setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }
        setError(null);
      }, 500); // Simulate API latency
    } catch (e: any) {
      console.error("Error adding item:", e);
      setError("Failed to add item to cart.");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (itemId: string) => {
    try {
      setLoading(true);
      setTimeout(() => {
        const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedCartItems);
        setError(null);
      }, 300);
    } catch (e: any) {
      console.error("Error removing item:", e);
      setError("Failed to remove item from cart.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    try {
      setLoading(true);
      setTimeout(() => {
        const updatedCartItems = cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );
        setCartItems(updatedCartItems);
        setError(null);
      }, 300);
    } catch (e: any) {
      console.error("Error updating quantity:", e);
      setError("Failed to update quantity.");
    } finally {
      setLoading(false);
    }
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
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
};

export default ShoppingCart;