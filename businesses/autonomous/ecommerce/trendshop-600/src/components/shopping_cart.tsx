// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface CartItemWithQuantity extends CartItem {
  quantity: number;
}

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItemWithQuantity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching cart items from an API
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        const response = await new Promise<CartItem[]>((resolve) => {
          setTimeout(() => {
            resolve([
              { id: '1', name: 'Product A', price: 25.00, imageUrl: 'https://example.com/productA.jpg' },
              { id: '2', name: 'Product B', price: 50.00, imageUrl: 'https://example.com/productB.jpg' },
            ]);
          }, 500); // Simulate network latency
        });

        // Add quantity to each item
        const itemsWithQuantity: CartItemWithQuantity[] = response.map(item => ({ ...item, quantity: 1 }));
        setCartItems(itemsWithQuantity);
      } catch (err: any) {
        console.error("Error fetching cart items:", err);
        setError("Failed to load cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item // Ensure quantity is not less than 1
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax rate
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
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
              <img src={item.imageUrl} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />
              {item.name} - ${item.price} x {item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                style={{ width: '40px', textAlign: 'center' }}
              />
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      <p>Subtotal: ${calculateSubtotal().toFixed(2)}</p>
      <p>Tax: ${calculateTax().toFixed(2)}</p>
      <p>Total: ${calculateTotal().toFixed(2)}</p>

      <button disabled={cartItems.length === 0}>Proceed to Checkout</button>
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
  imageUrl: string;
}

interface CartItemWithQuantity extends CartItem {
  quantity: number;
}

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItemWithQuantity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching cart items from an API
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        const response = await new Promise<CartItem[]>((resolve) => {
          setTimeout(() => {
            resolve([
              { id: '1', name: 'Product A', price: 25.00, imageUrl: 'https://example.com/productA.jpg' },
              { id: '2', name: 'Product B', price: 50.00, imageUrl: 'https://example.com/productB.jpg' },
            ]);
          }, 500); // Simulate network latency
        });

        // Add quantity to each item
        const itemsWithQuantity: CartItemWithQuantity[] = response.map(item => ({ ...item, quantity: 1 }));
        setCartItems(itemsWithQuantity);
      } catch (err: any) {
        console.error("Error fetching cart items:", err);
        setError("Failed to load cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item // Ensure quantity is not less than 1
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax rate
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
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
              <img src={item.imageUrl} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />
              {item.name} - ${item.price} x {item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                style={{ width: '40px', textAlign: 'center' }}
              />
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      <p>Subtotal: ${calculateSubtotal().toFixed(2)}</p>
      <p>Tax: ${calculateTax().toFixed(2)}</p>
      <p>Total: ${calculateTotal().toFixed(2)}</p>

      <button disabled={cartItems.length === 0}>Proceed to Checkout</button>
    </div>
  );
};

export default ShoppingCart;