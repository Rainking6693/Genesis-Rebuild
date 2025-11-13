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
        setError(null);
      }, 500); // Simulate API latency
    } catch (e: any) {
      setError(`Failed to add item: ${e.message}`);
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
        setError(null);
      }, 300);
    } catch (e: any) {
      setError(`Failed to remove item: ${e.message}`);
      setLoading(false);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    try {
      if (quantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      setLoading(true);
      setTimeout(() => {
        const updatedCartItems = cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );
        setCartItems(updatedCartItems);
        setLoading(false);
        setError(null);
      }, 300);
    } catch (e: any) {
      setError(`Failed to update quantity: ${e.message}`);
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  };

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
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
      {/* Example usage of addItem */}
      {/* <button onClick={() => addItem({ id: 'product1', name: 'Product 1', price: 20 })}>Add Product 1</button> */}
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
        setError(null);
      }, 500); // Simulate API latency
    } catch (e: any) {
      setError(`Failed to add item: ${e.message}`);
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
        setError(null);
      }, 300);
    } catch (e: any) {
      setError(`Failed to remove item: ${e.message}`);
      setLoading(false);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    try {
      if (quantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      setLoading(true);
      setTimeout(() => {
        const updatedCartItems = cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );
        setCartItems(updatedCartItems);
        setLoading(false);
        setError(null);
      }, 300);
    } catch (e: any) {
      setError(`Failed to update quantity: ${e.message}`);
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  };

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
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
      {/* Example usage of addItem */}
      {/* <button onClick={() => addItem({ id: 'product1', name: 'Product 1', price: 20 })}>Add Product 1</button> */}
    </div>
  );
};

export default ShoppingCart;