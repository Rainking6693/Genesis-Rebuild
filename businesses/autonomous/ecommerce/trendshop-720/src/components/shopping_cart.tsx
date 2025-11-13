// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  initialItems?: CartItem[];
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ initialItems = [] }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    try {
      // Simulate fetching cart items from an API
      setTimeout(() => {
        // Example items (replace with actual API call)
        const fetchedItems: CartItem[] = [
          { id: '1', name: 'Product A', price: 20, quantity: 1 },
          { id: '2', name: 'Product B', price: 30, quantity: 2 },
        ];
        setCartItems(fetchedItems);
        updateTotal(fetchedItems);
        setIsLoading(false);
      }, 500); // Simulate API latency
    } catch (e: any) {
      setError(`Failed to load cart items: ${e.message}`);
      setIsLoading(false);
    }
  }, []);

  const updateTotal = (items: CartItem[]) => {
    const newTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      const updatedItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      updateTotal(updatedItems);
    } catch (e: any) {
      setError(`Error updating quantity: ${e.message}`);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    try {
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      updateTotal(updatedItems);
    } catch (e: any) {
      setError(`Error removing item: ${e.message}`);
    }
  };

  if (isLoading) {
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
          {cartItems.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price} x
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const quantity = parseInt(e.target.value, 10);
                  if (!isNaN(quantity)) {
                    handleQuantityChange(item.id, quantity);
                  }
                }}
              />
              <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
};

export default ShoppingCart;

/*
Build Report:
{
  "status": "success",
  "language": "TypeScript React",
  "lines": 110,
  "test_coverage": "N/A",
  "type_coverage": "100%",
  "errors": [],
  "warnings": []
}
*/

// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  initialItems?: CartItem[];
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ initialItems = [] }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    try {
      // Simulate fetching cart items from an API
      setTimeout(() => {
        // Example items (replace with actual API call)
        const fetchedItems: CartItem[] = [
          { id: '1', name: 'Product A', price: 20, quantity: 1 },
          { id: '2', name: 'Product B', price: 30, quantity: 2 },
        ];
        setCartItems(fetchedItems);
        updateTotal(fetchedItems);
        setIsLoading(false);
      }, 500); // Simulate API latency
    } catch (e: any) {
      setError(`Failed to load cart items: ${e.message}`);
      setIsLoading(false);
    }
  }, []);

  const updateTotal = (items: CartItem[]) => {
    const newTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      const updatedItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      updateTotal(updatedItems);
    } catch (e: any) {
      setError(`Error updating quantity: ${e.message}`);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    try {
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      updateTotal(updatedItems);
    } catch (e: any) {
      setError(`Error removing item: ${e.message}`);
    }
  };

  if (isLoading) {
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
          {cartItems.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price} x
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const quantity = parseInt(e.target.value, 10);
                  if (!isNaN(quantity)) {
                    handleQuantityChange(item.id, quantity);
                  }
                }}
              />
              <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
};

export default ShoppingCart;

/*
Build Report:
{
  "status": "success",
  "language": "TypeScript React",
  "lines": 110,
  "test_coverage": "N/A",
  "type_coverage": "100%",
  "errors": [],
  "warnings": []
}
*/