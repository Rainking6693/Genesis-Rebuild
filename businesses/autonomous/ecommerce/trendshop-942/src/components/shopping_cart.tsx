// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string; // Optional image URL
}

interface ShoppingCartProps {
  initialCartItems?: CartItem[];
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ initialCartItems = [] }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Calculate total whenever cartItems change
    const newTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [cartItems]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      setLoading(true);
      // Simulate adding to cart (e.g., API call)
      setTimeout(() => {
        const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

        if (existingItemIndex !== -1) {
          // Item already exists, update quantity
          const updatedCartItems = [...cartItems];
          updatedCartItems[existingItemIndex].quantity += 1;
          setCartItems(updatedCartItems);
        } else {
          // Item doesn't exist, add to cart
          setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }
        setLoading(false);
        setError(null);
      }, 500); // Simulate API latency
    } catch (e: any) {
      console.error("Error adding item to cart:", e);
      setError("Failed to add item to cart. Please try again.");
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
      console.error("Error removing item from cart:", e);
      setError("Failed to remove item from cart. Please try again.");
      setLoading(false);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      alert("Quantity cannot be negative.");
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
        setError(null);
      }, 300);
    } catch (e: any) {
      console.error("Error updating quantity:", e);
      setError("Failed to update quantity. Please try again.");
      setLoading(false);
    }
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
              {item.image && <img src={item.image} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />}
              {item.name} - ${item.price} - Quantity:
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                style={{ width: '50px', marginLeft: '5px' }}
              />
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${total.toFixed(2)}</p>
      {/* Example usage of addItem (replace with actual product data) */}
      <button onClick={() => addItem({ id: 'product1', name: 'Example Product', price: 19.99 })}>
        Add Example Product
      </button>
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
  image?: string; // Optional image URL
}

interface ShoppingCartProps {
  initialCartItems?: CartItem[];
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ initialCartItems = [] }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Calculate total whenever cartItems change
    const newTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }, [cartItems]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      setLoading(true);
      // Simulate adding to cart (e.g., API call)
      setTimeout(() => {
        const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

        if (existingItemIndex !== -1) {
          // Item already exists, update quantity
          const updatedCartItems = [...cartItems];
          updatedCartItems[existingItemIndex].quantity += 1;
          setCartItems(updatedCartItems);
        } else {
          // Item doesn't exist, add to cart
          setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }
        setLoading(false);
        setError(null);
      }, 500); // Simulate API latency
    } catch (e: any) {
      console.error("Error adding item to cart:", e);
      setError("Failed to add item to cart. Please try again.");
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
      console.error("Error removing item from cart:", e);
      setError("Failed to remove item from cart. Please try again.");
      setLoading(false);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      alert("Quantity cannot be negative.");
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
        setError(null);
      }, 300);
    } catch (e: any) {
      console.error("Error updating quantity:", e);
      setError("Failed to update quantity. Please try again.");
      setLoading(false);
    }
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
              {item.image && <img src={item.image} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />}
              {item.name} - ${item.price} - Quantity:
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                style={{ width: '50px', marginLeft: '5px' }}
              />
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${total.toFixed(2)}</p>
      {/* Example usage of addItem (replace with actual product data) */}
      <button onClick={() => addItem({ id: 'product1', name: 'Example Product', price: 19.99 })}>
        Add Example Product
      </button>
    </div>
  );
};

export default ShoppingCart;