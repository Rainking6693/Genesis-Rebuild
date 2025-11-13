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
  // Add any props needed for the cart, e.g., currency
  currency?: string;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ currency = "USD" }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading cart data from local storage or an API
    setIsLoading(true);
    try {
      // Simulate fetching cart data (replace with actual API call or local storage retrieval)
      const storedCart = localStorage.getItem('cart');
      const initialCart = storedCart ? JSON.parse(storedCart) : [];
      setCartItems(initialCart);
    } catch (e: any) {
      console.error("Error loading cart:", e);
      setError("Failed to load cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Calculate total whenever cartItems change
    const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
    // Persist cart to local storage
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex > -1) {
        const updatedCart = [...cartItems];
        updatedCart[existingItemIndex].quantity += 1;
        setCartItems(updatedCart);
      } else {
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
      setError(null); // Clear any previous errors
    } catch (e: any) {
      console.error("Error adding item:", e);
      setError("Failed to add item to cart.");
    }
  };

  const removeItem = (itemId: string) => {
    try {
      const updatedCart = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCart);
      setError(null);
    } catch (e: any) {
      console.error("Error removing item:", e);
      setError("Failed to remove item from cart.");
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      const updatedCart = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);
      setError(null);
    } catch (e: any) {
      console.error("Error updating quantity:", e);
      setError(e.message || "Failed to update quantity.");
    }
  };

  const clearCart = () => {
    try {
      setCartItems([]);
      setError(null);
    } catch (e: any) {
      console.error("Error clearing cart:", e);
      setError("Failed to clear cart.");
    }
  };

  if (isLoading) {
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
              {item.image && <img src={item.image} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />}
              {item.name} - {currency}{item.price} x {item.quantity} = {currency}{item.price * item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value);
                  if (!isNaN(newQuantity)) {
                    updateQuantity(item.id, newQuantity);
                  }
                }}
                style={{ width: '50px', textAlign: 'center' }}
              />
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: {currency}{total}</p>
      <button onClick={clearCart}>Clear Cart</button>
      {/* Example usage of addItem (replace with actual item data) */}
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
  image?: string; // Optional image URL
}

interface ShoppingCartProps {
  // Add any props needed for the cart, e.g., currency
  currency?: string;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ currency = "USD" }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading cart data from local storage or an API
    setIsLoading(true);
    try {
      // Simulate fetching cart data (replace with actual API call or local storage retrieval)
      const storedCart = localStorage.getItem('cart');
      const initialCart = storedCart ? JSON.parse(storedCart) : [];
      setCartItems(initialCart);
    } catch (e: any) {
      console.error("Error loading cart:", e);
      setError("Failed to load cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Calculate total whenever cartItems change
    const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
    // Persist cart to local storage
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex > -1) {
        const updatedCart = [...cartItems];
        updatedCart[existingItemIndex].quantity += 1;
        setCartItems(updatedCart);
      } else {
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
      setError(null); // Clear any previous errors
    } catch (e: any) {
      console.error("Error adding item:", e);
      setError("Failed to add item to cart.");
    }
  };

  const removeItem = (itemId: string) => {
    try {
      const updatedCart = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCart);
      setError(null);
    } catch (e: any) {
      console.error("Error removing item:", e);
      setError("Failed to remove item from cart.");
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      const updatedCart = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);
      setError(null);
    } catch (e: any) {
      console.error("Error updating quantity:", e);
      setError(e.message || "Failed to update quantity.");
    }
  };

  const clearCart = () => {
    try {
      setCartItems([]);
      setError(null);
    } catch (e: any) {
      console.error("Error clearing cart:", e);
      setError("Failed to clear cart.");
    }
  };

  if (isLoading) {
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
              {item.image && <img src={item.image} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />}
              {item.name} - {currency}{item.price} x {item.quantity} = {currency}{item.price * item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value);
                  if (!isNaN(newQuantity)) {
                    updateQuantity(item.id, newQuantity);
                  }
                }}
                style={{ width: '50px', textAlign: 'center' }}
              />
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: {currency}{total}</p>
      <button onClick={clearCart}>Clear Cart</button>
      {/* Example usage of addItem (replace with actual item data) */}
      {/* <button onClick={() => addItem({ id: 'new-item', name: 'New Item', price: 20 })}>Add New Item</button> */}
    </div>
  );
};

export default ShoppingCart;