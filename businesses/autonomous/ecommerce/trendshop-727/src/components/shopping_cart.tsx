// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  // Optional:  If you're fetching cart data from an API, you might need a user ID or session ID
  // userId?: string;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ /* userId */ }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching cart data (replace with actual API call)
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulate initial cart data (replace with data from API)
        const initialCartData: CartItem[] = [
          { id: '1', name: 'Product A', price: 20, quantity: 1 },
          { id: '2', name: 'Product B', price: 30, quantity: 2 },
        ];

        setCartItems(initialCartData);
        setLoading(false);
      } catch (err: any) {
        setError("Failed to load cart data.");
        setLoading(false);
        console.error("Error fetching cart data:", err);
      }
    };

    fetchCartData();
  }, []); // Removed userId from dependency array as it's optional and not used in the simulated fetch

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      alert("Quantity cannot be negative.");
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const calculateTotal = (): number => {
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
          {cartItems.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price} x
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const quantity = parseInt(e.target.value);
                  if (!isNaN(quantity)) {
                    handleQuantityChange(item.id, quantity);
                  }
                }}
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
  // Optional:  If you're fetching cart data from an API, you might need a user ID or session ID
  // userId?: string;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ /* userId */ }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching cart data (replace with actual API call)
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulate initial cart data (replace with data from API)
        const initialCartData: CartItem[] = [
          { id: '1', name: 'Product A', price: 20, quantity: 1 },
          { id: '2', name: 'Product B', price: 30, quantity: 2 },
        ];

        setCartItems(initialCartData);
        setLoading(false);
      } catch (err: any) {
        setError("Failed to load cart data.");
        setLoading(false);
        console.error("Error fetching cart data:", err);
      }
    };

    fetchCartData();
  }, []); // Removed userId from dependency array as it's optional and not used in the simulated fetch

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      alert("Quantity cannot be negative.");
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const calculateTotal = (): number => {
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
          {cartItems.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price} x
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const quantity = parseInt(e.target.value);
                  if (!isNaN(quantity)) {
                    handleQuantityChange(item.id, quantity);
                  }
                }}
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