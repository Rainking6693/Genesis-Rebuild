// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  initialItems?: CartItem[];
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ initialItems = [] }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      setLoading(true);
      // Simulate adding to cart (e.g., API call)
      setTimeout(() => {
        const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

        if (existingItemIndex !== -1) {
          const updatedCartItems = [...cartItems];
          updatedCartItems[existingItemIndex].quantity += 1;
          setCartItems(updatedCartItems);
        } else {
          setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }
        setLoading(false);
      }, 500); // Simulate API latency
    } catch (e: any) {
      setError(e.message || "Failed to add item to cart.");
      setLoading(false);
    }
  };

  const removeItem = (itemId: string) => {
    try {
      setLoading(true);
      setTimeout(() => {
        const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedCartItems);
        setLoading(false);
      }, 300);
    } catch (e: any) {
      setError(e.message || "Failed to remove item from cart.");
      setLoading(false);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    try {
      setLoading(true);
      setTimeout(() => {
        const updatedCartItems = cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCartItems);
        setLoading(false);
      }, 300);
    } catch (e: any) {
      setError(e.message || "Failed to update quantity.");
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  };

  if (error) {
    return (
      <div>
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <h2>Shopping Cart</h2>
      {loading && <p>Loading...</p>}
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

// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  initialItems?: CartItem[];
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ initialItems = [] }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      setLoading(true);
      // Simulate adding to cart (e.g., API call)
      setTimeout(() => {
        const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

        if (existingItemIndex !== -1) {
          const updatedCartItems = [...cartItems];
          updatedCartItems[existingItemIndex].quantity += 1;
          setCartItems(updatedCartItems);
        } else {
          setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }
        setLoading(false);
      }, 500); // Simulate API latency
    } catch (e: any) {
      setError(e.message || "Failed to add item to cart.");
      setLoading(false);
    }
  };

  const removeItem = (itemId: string) => {
    try {
      setLoading(true);
      setTimeout(() => {
        const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedCartItems);
        setLoading(false);
      }, 300);
    } catch (e: any) {
      setError(e.message || "Failed to remove item from cart.");
      setLoading(false);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    try {
      setLoading(true);
      setTimeout(() => {
        const updatedCartItems = cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCartItems);
        setLoading(false);
      }, 300);
    } catch (e: any) {
      setError(e.message || "Failed to update quantity.");
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  };

  if (error) {
    return (
      <div>
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <h2>Shopping Cart</h2>
      {loading && <p>Loading...</p>}
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