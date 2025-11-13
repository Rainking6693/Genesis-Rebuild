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
  const [cartTotal, setCartTotal] = useState<number>(0);

  useEffect(() => {
    // Load cart data from local storage on component mount
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart) as CartItem[];
        setCartItems(parsedCart);
        calculateTotal(parsedCart);
      }
    } catch (error) {
      console.error("Error loading cart from local storage:", error);
      // Handle the error gracefully, e.g., display an error message to the user
    }
  }, []);

  useEffect(() => {
    // Save cart data to local storage whenever cartItems change
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
      calculateTotal(cartItems);
    } catch (error) {
      console.error("Error saving cart to local storage:", error);
      // Handle the error gracefully
    }
  }, [cartItems]);

  const calculateTotal = (items: CartItem[]) => {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setCartTotal(total);
  };

  const addItemToCart = (item: { id: string; name: string; price: number }) => {
    try {
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        // Item already exists in the cart, update the quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Item doesn't exist in the cart, add it
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      // Handle the error gracefully
    }
  };

  const removeItemFromCart = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Error removing item from cart:", error);
      // Handle the error gracefully
    }
  };

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        // Remove the item if the quantity is zero or negative
        removeItemFromCart(itemId);
        return;
      }

      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Error updating item quantity:", error);
      // Handle the error gracefully
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
              <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItemFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${cartTotal}</p>
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
  const [cartTotal, setCartTotal] = useState<number>(0);

  useEffect(() => {
    // Load cart data from local storage on component mount
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart) as CartItem[];
        setCartItems(parsedCart);
        calculateTotal(parsedCart);
      }
    } catch (error) {
      console.error("Error loading cart from local storage:", error);
      // Handle the error gracefully, e.g., display an error message to the user
    }
  }, []);

  useEffect(() => {
    // Save cart data to local storage whenever cartItems change
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
      calculateTotal(cartItems);
    } catch (error) {
      console.error("Error saving cart to local storage:", error);
      // Handle the error gracefully
    }
  }, [cartItems]);

  const calculateTotal = (items: CartItem[]) => {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setCartTotal(total);
  };

  const addItemToCart = (item: { id: string; name: string; price: number }) => {
    try {
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        // Item already exists in the cart, update the quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Item doesn't exist in the cart, add it
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      // Handle the error gracefully
    }
  };

  const removeItemFromCart = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Error removing item from cart:", error);
      // Handle the error gracefully
    }
  };

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        // Remove the item if the quantity is zero or negative
        removeItemFromCart(itemId);
        return;
      }

      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Error updating item quantity:", error);
      // Handle the error gracefully
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
              <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItemFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${cartTotal}</p>
    </div>
  );
};

export default ShoppingCart;