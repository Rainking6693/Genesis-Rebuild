// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  initialCartItems?: CartItem[];
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ initialCartItems = [] }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Calculate total whenever cartItems change
    try {
      const newTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setTotal(newTotal);
      setError(null); // Clear any previous errors
    } catch (e: any) {
      console.error("Error calculating total:", e);
      setError("Error calculating cart total. Please try again.");
    }
  }, [cartItems]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Item doesn't exist, add it to the cart
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
      setError(null);
    } catch (e: any) {
      console.error("Error adding item:", e);
      setError("Error adding item to cart. Please try again.");
    }
  };

  const removeItem = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
      setError(null);
    } catch (e: any) {
      console.error("Error removing item:", e);
      setError("Error removing item from cart. Please try again.");
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    try {
      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
      setError(null);
    } catch (e: any) {
      console.error("Error updating quantity:", e);
      setError("Error updating item quantity. Please try again.");
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
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
      {/* Example usage of addItem (replace with actual product data) */}
      {/* <button onClick={() => addItem({ id: 'product1', name: 'Example Product', price: 19.99 })}>Add Example Product</button> */}
    </div>
  );
};

export default ShoppingCart;

// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  initialCartItems?: CartItem[];
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ initialCartItems = [] }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Calculate total whenever cartItems change
    try {
      const newTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setTotal(newTotal);
      setError(null); // Clear any previous errors
    } catch (e: any) {
      console.error("Error calculating total:", e);
      setError("Error calculating cart total. Please try again.");
    }
  }, [cartItems]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Item doesn't exist, add it to the cart
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
      setError(null);
    } catch (e: any) {
      console.error("Error adding item:", e);
      setError("Error adding item to cart. Please try again.");
    }
  };

  const removeItem = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
      setError(null);
    } catch (e: any) {
      console.error("Error removing item:", e);
      setError("Error removing item from cart. Please try again.");
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    try {
      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
      setError(null);
    } catch (e: any) {
      console.error("Error updating quantity:", e);
      setError("Error updating item quantity. Please try again.");
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
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
      {/* Example usage of addItem (replace with actual product data) */}
      {/* <button onClick={() => addItem({ id: 'product1', name: 'Example Product', price: 19.99 })}>Add Example Product</button> */}
    </div>
  );
};

export default ShoppingCart;