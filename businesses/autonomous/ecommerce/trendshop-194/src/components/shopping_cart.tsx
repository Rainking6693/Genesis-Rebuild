// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  // Optional props, if any
}

const ShoppingCart: React.FC<ShoppingCartProps> = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching cart items from local storage or an API
    setLoading(true);
    try {
      // In a real application, you would fetch the cart items from an API or local storage
      const storedCartItems = localStorage.getItem('cartItems');
      const initialCartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
      setCartItems(initialCartItems);
    } catch (err: any) {
      console.error("Error loading cart items:", err);
      setError("Failed to load cart items.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Calculate total whenever cartItems change
    const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  }, [cartItems]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Item doesn't exist, add it to the cart
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Persist to local storage
    } catch (err: any) {
      console.error("Error adding item to cart:", err);
      setError("Failed to add item to cart.");
    }
  };

  const removeItem = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Persist to local storage
    } catch (err: any) {
      console.error("Error removing item from cart:", err);
      setError("Failed to remove item from cart.");
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    try {
      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Persist to local storage
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      setError("Failed to update quantity.");
    }
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
              {item.name} - ${item.price} x {item.quantity} = ${item.price * item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${total}</p>
      {/* Example usage of addItem */}
      {/* <button onClick={() => addItem({ id: 'product1', name: 'Product 1', price: 10 })}>Add Product 1</button> */}
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
  // Optional props, if any
}

const ShoppingCart: React.FC<ShoppingCartProps> = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching cart items from local storage or an API
    setLoading(true);
    try {
      // In a real application, you would fetch the cart items from an API or local storage
      const storedCartItems = localStorage.getItem('cartItems');
      const initialCartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
      setCartItems(initialCartItems);
    } catch (err: any) {
      console.error("Error loading cart items:", err);
      setError("Failed to load cart items.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Calculate total whenever cartItems change
    const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  }, [cartItems]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Item doesn't exist, add it to the cart
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Persist to local storage
    } catch (err: any) {
      console.error("Error adding item to cart:", err);
      setError("Failed to add item to cart.");
    }
  };

  const removeItem = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Persist to local storage
    } catch (err: any) {
      console.error("Error removing item from cart:", err);
      setError("Failed to remove item from cart.");
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    try {
      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Persist to local storage
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      setError("Failed to update quantity.");
    }
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
              {item.name} - ${item.price} x {item.quantity} = ${item.price * item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${total}</p>
      {/* Example usage of addItem */}
      {/* <button onClick={() => addItem({ id: 'product1', name: 'Product 1', price: 10 })}>Add Product 1</button> */}
    </div>
  );
};

export default ShoppingCart;