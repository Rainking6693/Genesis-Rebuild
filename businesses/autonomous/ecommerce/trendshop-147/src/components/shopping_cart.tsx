// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  // Add any necessary props here, e.g., API endpoint for fetching cart data
  apiEndpoint?: string;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ apiEndpoint }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);
      try {
        // Replace with actual API call if apiEndpoint is provided
        if (apiEndpoint) {
          const response = await fetch(apiEndpoint);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setCartItems(data); // Assuming API returns an array of CartItem
        } else {
          // Mock data for demonstration
          setCartItems([
            { id: '1', name: 'Product A', price: 20, quantity: 2 },
            { id: '2', name: 'Product B', price: 30, quantity: 1 },
          ]);
        }
        setError(null);
      } catch (e: any) {
        setError(`Failed to fetch cart data: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [apiEndpoint]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      alert("Quantity cannot be negative.");
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const calculateTotal = () => {
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
              {item.name} - ${item.price} - Quantity:
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
              />
              <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${calculateTotal()}</p>
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
  // Add any necessary props here, e.g., API endpoint for fetching cart data
  apiEndpoint?: string;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ apiEndpoint }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);
      try {
        // Replace with actual API call if apiEndpoint is provided
        if (apiEndpoint) {
          const response = await fetch(apiEndpoint);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setCartItems(data); // Assuming API returns an array of CartItem
        } else {
          // Mock data for demonstration
          setCartItems([
            { id: '1', name: 'Product A', price: 20, quantity: 2 },
            { id: '2', name: 'Product B', price: 30, quantity: 1 },
          ]);
        }
        setError(null);
      } catch (e: any) {
        setError(`Failed to fetch cart data: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [apiEndpoint]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      alert("Quantity cannot be negative.");
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const calculateTotal = () => {
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
              {item.name} - ${item.price} - Quantity:
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
              />
              <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${calculateTotal()}</p>
    </div>
  );
};

export default ShoppingCart;