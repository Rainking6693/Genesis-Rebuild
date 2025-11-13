// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  // Add any necessary props here
}

const ShoppingCart: React.FC<ShoppingCartProps> = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching cart items from an API
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        const response = await new Promise<CartItem[]>((resolve) => {
          setTimeout(() => {
            resolve([
              { id: '1', name: 'Product A', price: 20, quantity: 1 },
              { id: '2', name: 'Product B', price: 30, quantity: 2 },
            ]);
          }, 500); // Simulate API delay
        });

        setCartItems(response);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch cart items.');
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleAddItem = (item: CartItem) => {
    setCartItems([...cartItems, item]);
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotalPrice = () => {
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
              {item.name} - ${item.price} x {item.quantity}
              <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</button>
              <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${calculateTotalPrice()}</p>
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
  // Add any necessary props here
}

const ShoppingCart: React.FC<ShoppingCartProps> = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching cart items from an API
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        const response = await new Promise<CartItem[]>((resolve) => {
          setTimeout(() => {
            resolve([
              { id: '1', name: 'Product A', price: 20, quantity: 1 },
              { id: '2', name: 'Product B', price: 30, quantity: 2 },
            ]);
          }, 500); // Simulate API delay
        });

        setCartItems(response);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch cart items.');
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleAddItem = (item: CartItem) => {
    setCartItems([...cartItems, item]);
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotalPrice = () => {
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
              {item.name} - ${item.price} x {item.quantity}
              <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</button>
              <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${calculateTotalPrice()}</p>
    </div>
  );
};

export default ShoppingCart;