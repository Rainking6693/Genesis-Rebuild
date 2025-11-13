// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  // Props can be defined here if needed
}

const ShoppingCart: React.FC<ShoppingCartProps> = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching cart items from an API
    const fetchCartItems = async () => {
      setLoading(true);
      try {
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
        updateTotalPrice(response);
      } catch (err: any) {
        setError('Failed to load cart items.');
        console.error(err); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const updateTotalPrice = (items: CartItem[]) => {
    const newTotalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(newTotalPrice);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      setError("Quantity cannot be negative.");
      return;
    }
    try {
      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
      updateTotalPrice(updatedCartItems);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      setError("Failed to update quantity.");
      console.error(err);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
      updateTotalPrice(updatedCartItems);
      setError(null);
    } catch (err: any) {
      setError("Failed to remove item.");
      console.error(err);
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
      <p>Total: ${totalPrice}</p>
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
  // Props can be defined here if needed
}

const ShoppingCart: React.FC<ShoppingCartProps> = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching cart items from an API
    const fetchCartItems = async () => {
      setLoading(true);
      try {
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
        updateTotalPrice(response);
      } catch (err: any) {
        setError('Failed to load cart items.');
        console.error(err); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const updateTotalPrice = (items: CartItem[]) => {
    const newTotalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(newTotalPrice);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      setError("Quantity cannot be negative.");
      return;
    }
    try {
      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
      updateTotalPrice(updatedCartItems);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      setError("Failed to update quantity.");
      console.error(err);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
      updateTotalPrice(updatedCartItems);
      setError(null);
    } catch (err: any) {
      setError("Failed to remove item.");
      console.error(err);
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
      <p>Total: ${totalPrice}</p>
    </div>
  );
};

export default ShoppingCart;

**Build Report:**