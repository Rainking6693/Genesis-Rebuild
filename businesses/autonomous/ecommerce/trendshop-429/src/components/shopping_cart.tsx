// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  // Add any necessary props here, e.g., API endpoint for product details
  getProductDetails: (productId: string) => Promise<any>; // Example prop
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ getProductDetails }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Recalculate total price whenever cart items change
    const newTotalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(newTotalPrice);
  }, [cartItems]);

  const addItemToCart = async (productId: string) => {
    setLoading(true);
    setError(null);

    try {
      const productDetails = await getProductDetails(productId); // Fetch product details from API

      if (!productDetails) {
        throw new Error(`Product with ID ${productId} not found.`);
      }

      const existingItemIndex = cartItems.findIndex(item => item.productId === productId);

      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          productId: productDetails.id,
          name: productDetails.name,
          price: productDetails.price,
          quantity: 1,
        };
        setCartItems([...cartItems, newItem]);
      }
    } catch (err: any) {
      console.error("Error adding item to cart:", err);
      setError(err.message || "Failed to add item to cart.");
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromCart = (productId: string) => {
    try {
      const updatedCartItems = cartItems.filter(item => item.productId !== productId);
      setCartItems(updatedCartItems);
    } catch (err: any) {
      console.error("Error removing item from cart:", err);
      setError(err.message || "Failed to remove item from cart.");
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      const updatedCartItems = cartItems.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      setError(err.message || "Failed to update quantity.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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
            <li key={item.productId}>
              {item.name} - Quantity: {item.quantity} - Price: ${item.price * item.quantity}
              <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
              <button onClick={() => removeItemFromCart(item.productId)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total Price: ${totalPrice.toFixed(2)}</p>
      {/* Example button to add item - replace with actual product ID */}
      <button onClick={() => addItemToCart("example_product_id")}>Add Example Product</button>
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
  // Add any necessary props here, e.g., API endpoint for product details
  getProductDetails: (productId: string) => Promise<any>; // Example prop
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ getProductDetails }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Recalculate total price whenever cart items change
    const newTotalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(newTotalPrice);
  }, [cartItems]);

  const addItemToCart = async (productId: string) => {
    setLoading(true);
    setError(null);

    try {
      const productDetails = await getProductDetails(productId); // Fetch product details from API

      if (!productDetails) {
        throw new Error(`Product with ID ${productId} not found.`);
      }

      const existingItemIndex = cartItems.findIndex(item => item.productId === productId);

      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          productId: productDetails.id,
          name: productDetails.name,
          price: productDetails.price,
          quantity: 1,
        };
        setCartItems([...cartItems, newItem]);
      }
    } catch (err: any) {
      console.error("Error adding item to cart:", err);
      setError(err.message || "Failed to add item to cart.");
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromCart = (productId: string) => {
    try {
      const updatedCartItems = cartItems.filter(item => item.productId !== productId);
      setCartItems(updatedCartItems);
    } catch (err: any) {
      console.error("Error removing item from cart:", err);
      setError(err.message || "Failed to remove item from cart.");
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      const updatedCartItems = cartItems.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      setError(err.message || "Failed to update quantity.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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
            <li key={item.productId}>
              {item.name} - Quantity: {item.quantity} - Price: ${item.price * item.quantity}
              <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
              <button onClick={() => removeItemFromCart(item.productId)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total Price: ${totalPrice.toFixed(2)}</p>
      {/* Example button to add item - replace with actual product ID */}
      <button onClick={() => addItemToCart("example_product_id")}>Add Example Product</button>
    </div>
  );
};

export default ShoppingCart;