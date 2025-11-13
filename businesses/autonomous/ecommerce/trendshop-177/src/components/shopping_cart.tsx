// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  // Example:  Function to fetch product details
  getProductDetails: (productId: string) => Promise<{ name: string; price: number }>;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ getProductDetails }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const addItem = async (productId: string, quantity: number) => {
    setLoading(true);
    setError(null);

    try {
      const productDetails = await getProductDetails(productId);

      if (!productDetails) {
        throw new Error(`Product with ID ${productId} not found.`);
      }

      const existingItemIndex = cartItems.findIndex(item => item.productId === productId);

      if (existingItemIndex !== -1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += quantity;
        setCartItems(updatedCartItems);
      } else {
        const newItem: CartItem = {
          productId,
          name: productDetails.name,
          price: productDetails.price,
          quantity,
        };
        setCartItems([...cartItems, newItem]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add item to cart.');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (productId: string) => {
    try {
      const updatedCartItems = cartItems.filter(item => item.productId !== productId);
      setCartItems(updatedCartItems);
    } catch (err: any) {
      setError(err.message || 'Failed to remove item from cart.');
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    try {
      const updatedCartItems = cartItems.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
    } catch (err: any) {
      setError(err.message || 'Failed to update quantity.');
    }
  };

  const calculateTotal = () => {
    try {
      const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotal(newTotal);
    } catch (err: any) {
      setError(err.message || 'Failed to calculate total.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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
          {cartItems.map(item => (
            <li key={item.productId}>
              {item.name} - Quantity: {item.quantity} - Price: ${item.price * item.quantity}
              <button onClick={() => removeItem(item.productId)}>Remove</button>
              <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${total}</p>
      <button onClick={() => addItem("test-product", 1)}>Add Test Product</button>
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
  // Example:  Function to fetch product details
  getProductDetails: (productId: string) => Promise<{ name: string; price: number }>;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ getProductDetails }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const addItem = async (productId: string, quantity: number) => {
    setLoading(true);
    setError(null);

    try {
      const productDetails = await getProductDetails(productId);

      if (!productDetails) {
        throw new Error(`Product with ID ${productId} not found.`);
      }

      const existingItemIndex = cartItems.findIndex(item => item.productId === productId);

      if (existingItemIndex !== -1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += quantity;
        setCartItems(updatedCartItems);
      } else {
        const newItem: CartItem = {
          productId,
          name: productDetails.name,
          price: productDetails.price,
          quantity,
        };
        setCartItems([...cartItems, newItem]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add item to cart.');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (productId: string) => {
    try {
      const updatedCartItems = cartItems.filter(item => item.productId !== productId);
      setCartItems(updatedCartItems);
    } catch (err: any) {
      setError(err.message || 'Failed to remove item from cart.');
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    try {
      const updatedCartItems = cartItems.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
    } catch (err: any) {
      setError(err.message || 'Failed to update quantity.');
    }
  };

  const calculateTotal = () => {
    try {
      const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotal(newTotal);
    } catch (err: any) {
      setError(err.message || 'Failed to calculate total.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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
          {cartItems.map(item => (
            <li key={item.productId}>
              {item.name} - Quantity: {item.quantity} - Price: ${item.price * item.quantity}
              <button onClick={() => removeItem(item.productId)}>Remove</button>
              <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${total}</p>
      <button onClick={() => addItem("test-product", 1)}>Add Test Product</button>
    </div>
  );
};

export default ShoppingCart;

Now, I will use the `Write` tool to save this code to a file.

Finally, I will generate the build report.