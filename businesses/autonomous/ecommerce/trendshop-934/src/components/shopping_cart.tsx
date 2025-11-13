// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load cart items from local storage on component mount
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (e: any) {
      console.error("Error loading cart from local storage:", e);
      setError("Failed to load cart. Please try again.");
    }
  }, []);

  useEffect(() => {
    // Update total price whenever cart items change
    const newTotalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(newTotalPrice);

    // Save cart items to local storage
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (e: any) {
      console.error("Error saving cart to local storage:", e);
      setError("Failed to save cart. Changes may not be saved.");
    }
  }, [cartItems]);

  const addItem = (item: { id: string; name: string; price: number }) => {
    try {
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        // Item already exists in cart, update quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Item doesn't exist in cart, add it
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
      setError(null); // Clear any previous errors
    } catch (e: any) {
      console.error("Error adding item to cart:", e);
      setError("Failed to add item to cart.");
    }
  };

  const removeItem = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
      setError(null);
    } catch (e: any) {
      console.error("Error removing item from cart:", e);
      setError("Failed to remove item from cart.");
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        // Remove item if quantity is zero or negative
        removeItem(itemId);
        return;
      }

      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
      setError(null);
    } catch (e: any) {
      console.error("Error updating quantity:", e);
      setError("Failed to update quantity.");
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
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
          <p>Total: ${totalPrice}</p>
        </>
      )}
      {/* Example usage of addItem (replace with actual product data) */}
      <button onClick={() => addItem({ id: '1', name: 'Product 1', price: 20 })}>Add Product 1</button>
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

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load cart items from local storage on component mount
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (e: any) {
      console.error("Error loading cart from local storage:", e);
      setError("Failed to load cart. Please try again.");
    }
  }, []);

  useEffect(() => {
    // Update total price whenever cart items change
    const newTotalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(newTotalPrice);

    // Save cart items to local storage
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (e: any) {
      console.error("Error saving cart to local storage:", e);
      setError("Failed to save cart. Changes may not be saved.");
    }
  }, [cartItems]);

  const addItem = (item: { id: string; name: string; price: number }) => {
    try {
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        // Item already exists in cart, update quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Item doesn't exist in cart, add it
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
      setError(null); // Clear any previous errors
    } catch (e: any) {
      console.error("Error adding item to cart:", e);
      setError("Failed to add item to cart.");
    }
  };

  const removeItem = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
      setError(null);
    } catch (e: any) {
      console.error("Error removing item from cart:", e);
      setError("Failed to remove item from cart.");
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        // Remove item if quantity is zero or negative
        removeItem(itemId);
        return;
      }

      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
      setError(null);
    } catch (e: any) {
      console.error("Error updating quantity:", e);
      setError("Failed to update quantity.");
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
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
          <p>Total: ${totalPrice}</p>
        </>
      )}
      {/* Example usage of addItem (replace with actual product data) */}
      <button onClick={() => addItem({ id: '1', name: 'Product 1', price: 20 })}>Add Product 1</button>
    </div>
  );
};

export default ShoppingCart;