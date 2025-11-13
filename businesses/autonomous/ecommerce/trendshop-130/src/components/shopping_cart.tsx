import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  // Example prop - can be expanded
  userId: string;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ userId }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        // Simulate fetching cart items from an API
        const response = await fetch(`/api/cart/${userId}`); // Replace with actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: CartItem[] = await response.json();
        setCartItems(data);
      } catch (e: any) {
        setError(e.message);
        console.error("Error fetching cart items:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]);

  const addItem = (item: CartItem) => {
    try {
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);

        if (existingItemIndex > -1) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += 1;
          return updatedItems;
        } else {
          return [...prevItems, { ...item, quantity: 1 }];
        }
      });
    } catch (e: any) {
      console.error("Error adding item to cart:", e);
      setError("Failed to add item to cart."); // User-friendly error message
    }
  };

  const removeItem = (itemId: string) => {
    try {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (e: any) {
      console.error("Error removing item from cart:", e);
      setError("Failed to remove item from cart."); // User-friendly error message
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    try {
      if (quantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: quantity } : item
        )
      );
    } catch (e: any) {
      console.error("Error updating quantity:", e);
      setError("Failed to update quantity: " + e.message); // User-friendly error message
    }
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
              {item.name} - Quantity: {item.quantity} - Price: ${item.price * item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${calculateTotal()}</p>
      <button onClick={() => addItem({ id: 'new-item', name: 'New Item', price: 20, quantity: 0 })}>Add Item</button>
    </div>
  );
};

export default ShoppingCart;

import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  // Example prop - can be expanded
  userId: string;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ userId }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        // Simulate fetching cart items from an API
        const response = await fetch(`/api/cart/${userId}`); // Replace with actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: CartItem[] = await response.json();
        setCartItems(data);
      } catch (e: any) {
        setError(e.message);
        console.error("Error fetching cart items:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]);

  const addItem = (item: CartItem) => {
    try {
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);

        if (existingItemIndex > -1) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += 1;
          return updatedItems;
        } else {
          return [...prevItems, { ...item, quantity: 1 }];
        }
      });
    } catch (e: any) {
      console.error("Error adding item to cart:", e);
      setError("Failed to add item to cart."); // User-friendly error message
    }
  };

  const removeItem = (itemId: string) => {
    try {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (e: any) {
      console.error("Error removing item from cart:", e);
      setError("Failed to remove item from cart."); // User-friendly error message
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    try {
      if (quantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: quantity } : item
        )
      );
    } catch (e: any) {
      console.error("Error updating quantity:", e);
      setError("Failed to update quantity: " + e.message); // User-friendly error message
    }
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
              {item.name} - Quantity: {item.quantity} - Price: ${item.price * item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${calculateTotal()}</p>
      <button onClick={() => addItem({ id: 'new-item', name: 'New Item', price: 20, quantity: 0 })}>Add Item</button>
    </div>
  );
};

export default ShoppingCart;

**Action:** Write

**File Path:** `build_report.json`

**Content:**