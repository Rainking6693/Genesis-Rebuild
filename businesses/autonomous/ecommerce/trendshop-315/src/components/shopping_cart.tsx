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
    setLoading(true);
    try {
      // Simulate fetching cart items from an API
      setTimeout(() => {
        // Example items (replace with actual API call)
        const fetchedItems: CartItem[] = [
          { id: '1', name: 'Product A', price: 20, quantity: 1 },
          { id: '2', name: 'Product B', price: 30, quantity: 2 },
        ];
        setCartItems(fetchedItems);
        updateTotal(fetchedItems);
        setLoading(false);
      }, 500); // Simulate API latency
    } catch (e: any) {
      setError(`Failed to fetch cart items: ${e.message}`);
      setLoading(false);
    }
  }, []);

  const updateTotal = (items: CartItem[]) => {
    const newTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      const updatedItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      updateTotal(updatedItems);
    } catch (e: any) {
      setError(`Error updating quantity: ${e.message}`);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    try {
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      updateTotal(updatedItems);
    } catch (e: any) {
      setError(`Error removing item: ${e.message}`);
    }
  };

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price} x {item.quantity} = ${item.price * item.quantity}
              <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value);
                  if (!isNaN(newQuantity)) {
                    handleQuantityChange(item.id, newQuantity);
                  }
                }}
              />
              <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${total}</p>
      <button>Checkout</button>
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
    setLoading(true);
    try {
      // Simulate fetching cart items from an API
      setTimeout(() => {
        // Example items (replace with actual API call)
        const fetchedItems: CartItem[] = [
          { id: '1', name: 'Product A', price: 20, quantity: 1 },
          { id: '2', name: 'Product B', price: 30, quantity: 2 },
        ];
        setCartItems(fetchedItems);
        updateTotal(fetchedItems);
        setLoading(false);
      }, 500); // Simulate API latency
    } catch (e: any) {
      setError(`Failed to fetch cart items: ${e.message}`);
      setLoading(false);
    }
  }, []);

  const updateTotal = (items: CartItem[]) => {
    const newTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      const updatedItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      updateTotal(updatedItems);
    } catch (e: any) {
      setError(`Error updating quantity: ${e.message}`);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    try {
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      updateTotal(updatedItems);
    } catch (e: any) {
      setError(`Error removing item: ${e.message}`);
    }
  };

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price} x {item.quantity} = ${item.price * item.quantity}
              <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value);
                  if (!isNaN(newQuantity)) {
                    handleQuantityChange(item.id, newQuantity);
                  }
                }}
              />
              <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${total}</p>
      <button>Checkout</button>
    </div>
  );
};

export default ShoppingCart;