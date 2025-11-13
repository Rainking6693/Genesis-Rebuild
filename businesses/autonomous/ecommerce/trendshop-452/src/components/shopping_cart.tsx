// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  initialCartItems?: CartItem[];
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ initialCartItems = [] }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate cart total whenever cartItems change
  useEffect(() => {
    try {
      setLoading(true);
      const newTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      setCartTotal(newTotal);
      setLoading(false);
    } catch (err: any) {
      setError(`Error calculating cart total: ${err.message}`);
      setLoading(false);
    }
  }, [cartItems]);

  // Function to add an item to the cart
  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        // Item already exists, update the quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Item doesn't exist, add it to the cart
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
      setError(null); // Clear any previous errors
    } catch (err: any) {
      setError(`Error adding item to cart: ${err.message}`);
    }
  };

  // Function to remove an item from the cart
  const removeItem = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      setError(`Error removing item from cart: ${err.message}`);
    }
  };

  // Function to update the quantity of an item in the cart
  const updateQuantity = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      setError(`Error updating quantity: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
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
          <p>Total: ${cartTotal.toFixed(2)}</p>
        </>
      )}
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

interface ShoppingCartProps {
  initialCartItems?: CartItem[];
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ initialCartItems = [] }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate cart total whenever cartItems change
  useEffect(() => {
    try {
      setLoading(true);
      const newTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      setCartTotal(newTotal);
      setLoading(false);
    } catch (err: any) {
      setError(`Error calculating cart total: ${err.message}`);
      setLoading(false);
    }
  }, [cartItems]);

  // Function to add an item to the cart
  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    try {
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        // Item already exists, update the quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Item doesn't exist, add it to the cart
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
      setError(null); // Clear any previous errors
    } catch (err: any) {
      setError(`Error adding item to cart: ${err.message}`);
    }
  };

  // Function to remove an item from the cart
  const removeItem = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      setError(`Error removing item from cart: ${err.message}`);
    }
  };

  // Function to update the quantity of an item in the cart
  const updateQuantity = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      setError(`Error updating quantity: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
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
          <p>Total: ${cartTotal.toFixed(2)}</p>
        </>
      )}
      {/* Example usage of addItem function */}
      {/* <button onClick={() => addItem({ id: 'product1', name: 'Product 1', price: 20 })}>Add Product 1</button> */}
    </div>
  );
};

export default ShoppingCart;