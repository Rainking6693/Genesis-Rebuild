// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Props {
  initialCart?: CartItem[];
}

const ShoppingCart: React.FC<Props> = ({ initialCart = [] }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    // Calculate total price whenever cartItems change
    const newTotalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotalPrice(newTotalPrice);
  }, [cartItems]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Add new item to cart
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
    } catch (error: any) {
      console.error("Error adding item to cart:", error.message);
      // Consider displaying an error message to the user
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const removeItem = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
    } catch (error: any) {
      console.error("Error removing item from cart:", error.message);
      // Consider displaying an error message to the user
      alert("Failed to remove item from cart. Please try again.");
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      console.warn("Quantity cannot be negative.");
      return; // Or throw an error
    }

    try {
      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
    } catch (error: any) {
      console.error("Error updating quantity:", error.message);
      // Consider displaying an error message to the user
      alert("Failed to update quantity. Please try again.");
    }
  };

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
      <p>Total: ${totalPrice.toFixed(2)}</p>
      {/* Example usage of addItem function */}
      {/* <button onClick={() => addItem({ id: 'product1', name: 'Product 1', price: 20 })}>Add Product 1</button> */}
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

interface Props {
  initialCart?: CartItem[];
}

const ShoppingCart: React.FC<Props> = ({ initialCart = [] }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    // Calculate total price whenever cartItems change
    const newTotalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotalPrice(newTotalPrice);
  }, [cartItems]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Add new item to cart
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
    } catch (error: any) {
      console.error("Error adding item to cart:", error.message);
      // Consider displaying an error message to the user
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const removeItem = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
    } catch (error: any) {
      console.error("Error removing item from cart:", error.message);
      // Consider displaying an error message to the user
      alert("Failed to remove item from cart. Please try again.");
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      console.warn("Quantity cannot be negative.");
      return; // Or throw an error
    }

    try {
      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
    } catch (error: any) {
      console.error("Error updating quantity:", error.message);
      // Consider displaying an error message to the user
      alert("Failed to update quantity. Please try again.");
    }
  };

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
      <p>Total: ${totalPrice.toFixed(2)}</p>
      {/* Example usage of addItem function */}
      {/* <button onClick={() => addItem({ id: 'product1', name: 'Product 1', price: 20 })}>Add Product 1</button> */}
    </div>
  );
};

export default ShoppingCart;