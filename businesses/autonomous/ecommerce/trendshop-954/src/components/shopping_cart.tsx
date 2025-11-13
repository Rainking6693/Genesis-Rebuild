// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  // Add any props if needed
}

const ShoppingCart: React.FC<ShoppingCartProps> = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching cart items from an API
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        // Simulate API call
        const response = await new Promise<CartItem[]>((resolve) => {
          setTimeout(() => {
            resolve([
              { id: '1', name: 'Product A', price: 20, quantity: 1 },
              { id: '2', name: 'Product B', price: 30, quantity: 2 },
            ]);
          }, 500); // Simulate API latency
        });

        setCartItems(response);
      } catch (e: any) {
        setError(`Failed to fetch cart items: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const addItem = async (itemId: string, itemName: string, itemPrice: number) => {
    setLoading(true);
    try {
      // Simulate API call to add item
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API latency

      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === itemId);
        if (existingItem) {
          return prevItems.map(item =>
            item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          return [...prevItems, { id: itemId, name: itemName, price: itemPrice, quantity: 1 }];
        }
      });

    } catch (e: any) {
      setError(`Failed to add item: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setLoading(true);
    try {
      // Simulate API call to remove item
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API latency

      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));

    } catch (e: any) {
      setError(`Failed to remove item: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to update quantity
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API latency

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: quantity } : item
        )
      );

    } catch (e: any) {
      setError(`Failed to update quantity: ${e.message}`);
    } finally {
      setLoading(false);
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
              {item.name} - ${item.price} x {item.quantity} = ${item.price * item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => addItem('3', 'New Product', 40)}>Add New Product</button>
      <p>Total: ${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}</p>
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
  // Add any props if needed
}

const ShoppingCart: React.FC<ShoppingCartProps> = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching cart items from an API
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        // Simulate API call
        const response = await new Promise<CartItem[]>((resolve) => {
          setTimeout(() => {
            resolve([
              { id: '1', name: 'Product A', price: 20, quantity: 1 },
              { id: '2', name: 'Product B', price: 30, quantity: 2 },
            ]);
          }, 500); // Simulate API latency
        });

        setCartItems(response);
      } catch (e: any) {
        setError(`Failed to fetch cart items: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const addItem = async (itemId: string, itemName: string, itemPrice: number) => {
    setLoading(true);
    try {
      // Simulate API call to add item
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API latency

      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === itemId);
        if (existingItem) {
          return prevItems.map(item =>
            item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          return [...prevItems, { id: itemId, name: itemName, price: itemPrice, quantity: 1 }];
        }
      });

    } catch (e: any) {
      setError(`Failed to add item: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setLoading(true);
    try {
      // Simulate API call to remove item
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API latency

      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));

    } catch (e: any) {
      setError(`Failed to remove item: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call to update quantity
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API latency

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: quantity } : item
        )
      );

    } catch (e: any) {
      setError(`Failed to update quantity: ${e.message}`);
    } finally {
      setLoading(false);
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
              {item.name} - ${item.price} x {item.quantity} = ${item.price * item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => addItem('3', 'New Product', 40)}>Add New Product</button>
      <p>Total: ${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}</p>
    </div>
  );
};

export default ShoppingCart;