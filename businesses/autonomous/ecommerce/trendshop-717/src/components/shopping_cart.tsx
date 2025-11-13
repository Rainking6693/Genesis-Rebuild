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
      // Simulate fetching cart data from an API (replace with actual API call)
      setTimeout(() => {
        // Example data (replace with actual data from API)
        const fetchedItems: CartItem[] = [
          { id: '1', name: 'Product A', price: 25.00, quantity: 1 },
          { id: '2', name: 'Product B', price: 50.00, quantity: 2 },
        ];
        setCartItems(fetchedItems);
        updateTotal(fetchedItems);
        setLoading(false);
      }, 500); // Simulate API latency
    } catch (err: any) {
      setError(`Failed to load cart: ${err.message}`);
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
    } catch (err: any) {
      setError(`Error updating quantity: ${err.message}`);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    try {
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      updateTotal(updatedItems);
    } catch (err: any) {
      setError(`Error removing item: ${err.message}`);
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
              {item.name} - ${item.price} x
              <input
                type="number"
                value={item.quantity}
                min="0"
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
              />
              <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
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
    setLoading(true);
    try {
      // Simulate fetching cart data from an API (replace with actual API call)
      setTimeout(() => {
        // Example data (replace with actual data from API)
        const fetchedItems: CartItem[] = [
          { id: '1', name: 'Product A', price: 25.00, quantity: 1 },
          { id: '2', name: 'Product B', price: 50.00, quantity: 2 },
        ];
        setCartItems(fetchedItems);
        updateTotal(fetchedItems);
        setLoading(false);
      }, 500); // Simulate API latency
    } catch (err: any) {
      setError(`Failed to load cart: ${err.message}`);
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
    } catch (err: any) {
      setError(`Error updating quantity: ${err.message}`);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    try {
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      updateTotal(updatedItems);
    } catch (err: any) {
      setError(`Error removing item: ${err.message}`);
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
              {item.name} - ${item.price} x
              <input
                type="number"
                value={item.quantity}
                min="0"
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
              />
              <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
};

export default ShoppingCart;