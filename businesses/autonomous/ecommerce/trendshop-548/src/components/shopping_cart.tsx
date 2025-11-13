// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  // Optional:  Function to fetch product details (e.g., from an API)
  fetchProductDetails?: (productId: string) => Promise<any>;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ fetchProductDetails }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Recalculate total whenever cart items change
    const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  }, [cartItems]);

  const addItem = async (productId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch product details if a fetch function is provided
      let productDetails = { id: productId, name: `Product ${productId}`, price: 10 }; // Default values
      if (fetchProductDetails) {
        productDetails = await fetchProductDetails(productId);
      }

      const existingItemIndex = cartItems.findIndex(item => item.id === productId);

      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Item doesn't exist, add it to the cart
        const newItem: CartItem = {
          id: productId,
          name: productDetails.name || `Product ${productId}`,
          price: productDetails.price || 10,
          quantity: 1,
        };
        setCartItems([...cartItems, newItem]);
      }
    } catch (e: any) {
      console.error("Error adding item to cart:", e);
      setError(`Failed to add item to cart: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (productId: string) => {
    try {
      const updatedCartItems = cartItems.filter(item => item.id !== productId);
      setCartItems(updatedCartItems);
    } catch (e: any) {
      console.error("Error removing item from cart:", e);
      setError(`Failed to remove item from cart: ${e.message}`);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    try {
      const updatedCartItems = cartItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
    } catch (e: any) {
      console.error("Error updating quantity:", e);
      setError(`Failed to update quantity: ${e.message}`);
    }
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
          {cartItems.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price} x {item.quantity} = ${item.price * item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${total.toFixed(2)}</p>
      <button onClick={() => addItem("123")}>Add Item (Example)</button> {/* Example */}
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
  // Optional:  Function to fetch product details (e.g., from an API)
  fetchProductDetails?: (productId: string) => Promise<any>;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ fetchProductDetails }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Recalculate total whenever cart items change
    const newTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  }, [cartItems]);

  const addItem = async (productId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch product details if a fetch function is provided
      let productDetails = { id: productId, name: `Product ${productId}`, price: 10 }; // Default values
      if (fetchProductDetails) {
        productDetails = await fetchProductDetails(productId);
      }

      const existingItemIndex = cartItems.findIndex(item => item.id === productId);

      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Item doesn't exist, add it to the cart
        const newItem: CartItem = {
          id: productId,
          name: productDetails.name || `Product ${productId}`,
          price: productDetails.price || 10,
          quantity: 1,
        };
        setCartItems([...cartItems, newItem]);
      }
    } catch (e: any) {
      console.error("Error adding item to cart:", e);
      setError(`Failed to add item to cart: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (productId: string) => {
    try {
      const updatedCartItems = cartItems.filter(item => item.id !== productId);
      setCartItems(updatedCartItems);
    } catch (e: any) {
      console.error("Error removing item from cart:", e);
      setError(`Failed to remove item from cart: ${e.message}`);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    try {
      const updatedCartItems = cartItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
    } catch (e: any) {
      console.error("Error updating quantity:", e);
      setError(`Failed to update quantity: ${e.message}`);
    }
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
          {cartItems.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price} x {item.quantity} = ${item.price * item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${total.toFixed(2)}</p>
      <button onClick={() => addItem("123")}>Add Item (Example)</button> {/* Example */}
    </div>
  );
};

export default ShoppingCart;