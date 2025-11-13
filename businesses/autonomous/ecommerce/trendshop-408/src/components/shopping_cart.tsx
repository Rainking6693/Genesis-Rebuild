// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const ShoppingCart = () => {
  const [cart, setCart] = useState<CartState>({ items: [], total: 0 });

  useEffect(() => {
    // Recalculate total whenever items change
    const newTotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setCart({...cart, total: newTotal});
  }, [cart.items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      const existingItemIndex = cart.items.findIndex((i) => i.id === item.id);

      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        const updatedItems = [...cart.items];
        updatedItems[existingItemIndex].quantity += 1;
        setCart({...cart, items: updatedItems});
      } else {
        // Item doesn't exist, add it to the cart
        setCart({...cart, items: [...cart.items, { ...item, quantity: 1 }]});
      }
    } catch (error: any) {
      console.error("Error adding item to cart:", error);
      // Display error message to the user
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const removeItem = (itemId: string) => {
    try {
      const updatedItems = cart.items.filter((item) => item.id !== itemId);
      setCart({...cart, items: updatedItems});
    } catch (error: any) {
      console.error("Error removing item from cart:", error);
      // Display error message to the user
      alert("Failed to remove item from cart. Please try again.");
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative");
      }

      const updatedItems = cart.items.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCart({...cart, items: updatedItems});
    } catch (error: any) {
      console.error("Error updating quantity:", error);
      // Display error message to the user
      alert("Failed to update quantity. Please try again.");
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.items.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price} x {item.quantity} = ${item.price * item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${cart.total.toFixed(2)}</p>
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

interface CartState {
  items: CartItem[];
  total: number;
}

const ShoppingCart = () => {
  const [cart, setCart] = useState<CartState>({ items: [], total: 0 });

  useEffect(() => {
    // Recalculate total whenever items change
    const newTotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setCart({...cart, total: newTotal});
  }, [cart.items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      const existingItemIndex = cart.items.findIndex((i) => i.id === item.id);

      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        const updatedItems = [...cart.items];
        updatedItems[existingItemIndex].quantity += 1;
        setCart({...cart, items: updatedItems});
      } else {
        // Item doesn't exist, add it to the cart
        setCart({...cart, items: [...cart.items, { ...item, quantity: 1 }]});
      }
    } catch (error: any) {
      console.error("Error adding item to cart:", error);
      // Display error message to the user
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const removeItem = (itemId: string) => {
    try {
      const updatedItems = cart.items.filter((item) => item.id !== itemId);
      setCart({...cart, items: updatedItems});
    } catch (error: any) {
      console.error("Error removing item from cart:", error);
      // Display error message to the user
      alert("Failed to remove item from cart. Please try again.");
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative");
      }

      const updatedItems = cart.items.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCart({...cart, items: updatedItems});
    } catch (error: any) {
      console.error("Error updating quantity:", error);
      // Display error message to the user
      alert("Failed to update quantity. Please try again.");
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.items.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price} x {item.quantity} = ${item.price * item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${cart.total.toFixed(2)}</p>
    </div>
  );
};

export default ShoppingCart;