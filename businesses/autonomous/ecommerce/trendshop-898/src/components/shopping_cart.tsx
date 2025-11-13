// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const ShoppingCart = () => {
  const [cart, setCart] = useState<CartState>({ items: [], total: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading cart data from an API
    setLoading(true);
    setTimeout(() => {
      try {
        // Replace with actual API call
        const initialCart: CartState = {
          items: [
            { id: '1', name: 'Product A', price: 20, quantity: 1 },
            { id: '2', name: 'Product B', price: 30, quantity: 2 },
          ],
          total: 80, // Initial total
        };
        setCart(initialCart);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load cart');
        setLoading(false);
      }
    }, 500); // Simulate API latency
  }, []);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      const existingItem = cart.items.find((i) => i.id === item.id);
      if (existingItem) {
        updateQuantity(item.id, existingItem.quantity + 1);
      } else {
        setCart((prevCart) => ({
          items: [...prevCart.items, { ...item, quantity: 1 }],
          total: prevCart.total + item.price,
        }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add item');
    }
  };

  const removeItem = (itemId: string) => {
    try {
      const itemToRemove = cart.items.find((item) => item.id === itemId);
      if (itemToRemove) {
        setCart((prevCart) => ({
          items: prevCart.items.filter((item) => item.id !== itemId),
          total: prevCart.total - (itemToRemove.price * itemToRemove.quantity),
        }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to remove item');
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error('Quantity cannot be negative');
      }

      setCart((prevCart) => {
        const updatedItems = prevCart.items.map((item) => {
          if (item.id === itemId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });

        const newTotal = updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        return { items: updatedItems, total: newTotal };
      });
    } catch (err: any) {
      setError(err.message || 'Failed to update quantity');
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
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.items.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price} - Quantity: {item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${cart.total}</p>
    </div>
  );
};

export default ShoppingCart;