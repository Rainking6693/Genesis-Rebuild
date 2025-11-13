// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  // Add any necessary props for the component
}

const ShoppingCart: React.FC<ShoppingCartProps> = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching cart items from an API
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        const response = await new Promise<CartItem[]>((resolve) => {
          setTimeout(() => {
            resolve([
              { productId: '1', name: 'Product A', price: 20, quantity: 1 },
              { productId: '2', name: 'Product B', price: 30, quantity: 2 },
            ]);
          }, 500); // Simulate API latency
        });

        setCartItems(response);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch cart items.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleAddItem = (productId: string, name: string, price: number) => {
    try {
      const existingItemIndex = cartItems.findIndex(item => item.productId === productId);

      if (existingItemIndex !== -1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        const newItem: CartItem = { productId, name, price, quantity: 1 };
        setCartItems([...cartItems, newItem]);
      }
    } catch (err: any) {
      console.error("Error adding item:", err); // Log the error for debugging
      setError("Failed to add item to cart."); // Set an error message for the user
    }
  };

  const handleRemoveItem = (productId: string) => {
    try {
      const updatedCartItems = cartItems.filter(item => item.productId !== productId);
      setCartItems(updatedCartItems);
    } catch (err: any) {
      console.error("Error removing item:", err); // Log the error for debugging
      setError("Failed to remove item from cart."); // Set an error message for the user
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    try {
      if (quantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      const updatedCartItems = cartItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
      setCartItems(updatedCartItems);
    } catch (err: any) {
      console.error("Error updating quantity:", err); // Log the error for debugging
      setError(err.message || "Failed to update quantity."); // Set an error message for the user
    }
  };

  const calculateTotal = () => {
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
            <li key={item.productId}>
              {item.name} - Quantity: {item.quantity} - Price: ${item.price * item.quantity}
              <button onClick={() => handleRemoveItem(item.productId)}>Remove</button>
              <button onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}>-</button>
              <button onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}>+</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${calculateTotal()}</p>
      <button onClick={() => handleAddItem("3", "New Product", 15)}>Add Item</button>
    </div>
  );
};

export default ShoppingCart;

// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  // Add any necessary props for the component
}

const ShoppingCart: React.FC<ShoppingCartProps> = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching cart items from an API
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        const response = await new Promise<CartItem[]>((resolve) => {
          setTimeout(() => {
            resolve([
              { productId: '1', name: 'Product A', price: 20, quantity: 1 },
              { productId: '2', name: 'Product B', price: 30, quantity: 2 },
            ]);
          }, 500); // Simulate API latency
        });

        setCartItems(response);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch cart items.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleAddItem = (productId: string, name: string, price: number) => {
    try {
      const existingItemIndex = cartItems.findIndex(item => item.productId === productId);

      if (existingItemIndex !== -1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        const newItem: CartItem = { productId, name, price, quantity: 1 };
        setCartItems([...cartItems, newItem]);
      }
    } catch (err: any) {
      console.error("Error adding item:", err); // Log the error for debugging
      setError("Failed to add item to cart."); // Set an error message for the user
    }
  };

  const handleRemoveItem = (productId: string) => {
    try {
      const updatedCartItems = cartItems.filter(item => item.productId !== productId);
      setCartItems(updatedCartItems);
    } catch (err: any) {
      console.error("Error removing item:", err); // Log the error for debugging
      setError("Failed to remove item from cart."); // Set an error message for the user
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    try {
      if (quantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      const updatedCartItems = cartItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
      setCartItems(updatedCartItems);
    } catch (err: any) {
      console.error("Error updating quantity:", err); // Log the error for debugging
      setError(err.message || "Failed to update quantity."); // Set an error message for the user
    }
  };

  const calculateTotal = () => {
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
            <li key={item.productId}>
              {item.name} - Quantity: {item.quantity} - Price: ${item.price * item.quantity}
              <button onClick={() => handleRemoveItem(item.productId)}>Remove</button>
              <button onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}>-</button>
              <button onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}>+</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${calculateTotal()}</p>
      <button onClick={() => handleAddItem("3", "New Product", 15)}>Add Item</button>
    </div>
  );
};

export default ShoppingCart;