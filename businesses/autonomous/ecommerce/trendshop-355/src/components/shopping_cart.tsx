// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  // Optional:  A function to fetch initial cart data from an API
  fetchCartData?: () => Promise<CartItem[]>;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ fetchCartData }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fetchCartData) {
      const loadCartData = async () => {
        setLoading(true);
        try {
          const data = await fetchCartData();
          setCartItems(data);
        } catch (e: any) {
          setError(e.message || "Failed to load cart data.");
        } finally {
          setLoading(false);
        }
      };

      loadCartData();
    }
  }, [fetchCartData]);

  const addItem = (item: { id: string; name: string; price: number }) => {
    try {
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
    } catch (e: any) {
      console.error("Error adding item to cart:", e); // Log the error for debugging
      setError("Failed to add item to cart.");
    }
  };

  const removeItem = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
    } catch (e: any) {
      console.error("Error removing item from cart:", e);
      setError("Failed to remove item from cart.");
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 0) {
      console.warn("Quantity cannot be negative.");
      return; // Or throw an error, depending on requirements
    }
    try {
      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      setCartItems(updatedCartItems);
    } catch (e: any) {
      console.error("Error updating quantity:", e);
      setError("Failed to update quantity.");
    }
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
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price} x {item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${calculateTotal()}</p>
      {/* Example usage of addItem function */}
      {/* <button onClick={() => addItem({ id: 'new-item', name: 'New Item', price: 20 })}>Add New Item</button> */}
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
  // Optional:  A function to fetch initial cart data from an API
  fetchCartData?: () => Promise<CartItem[]>;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ fetchCartData }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fetchCartData) {
      const loadCartData = async () => {
        setLoading(true);
        try {
          const data = await fetchCartData();
          setCartItems(data);
        } catch (e: any) {
          setError(e.message || "Failed to load cart data.");
        } finally {
          setLoading(false);
        }
      };

      loadCartData();
    }
  }, [fetchCartData]);

  const addItem = (item: { id: string; name: string; price: number }) => {
    try {
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
    } catch (e: any) {
      console.error("Error adding item to cart:", e); // Log the error for debugging
      setError("Failed to add item to cart.");
    }
  };

  const removeItem = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
    } catch (e: any) {
      console.error("Error removing item from cart:", e);
      setError("Failed to remove item from cart.");
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 0) {
      console.warn("Quantity cannot be negative.");
      return; // Or throw an error, depending on requirements
    }
    try {
      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      setCartItems(updatedCartItems);
    } catch (e: any) {
      console.error("Error updating quantity:", e);
      setError("Failed to update quantity.");
    }
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
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price} x {item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${calculateTotal()}</p>
      {/* Example usage of addItem function */}
      {/* <button onClick={() => addItem({ id: 'new-item', name: 'New Item', price: 20 })}>Add New Item</button> */}
    </div>
  );
};

export default ShoppingCart;