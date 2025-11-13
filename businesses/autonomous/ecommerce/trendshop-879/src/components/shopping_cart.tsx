// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching cart data from local storage or an API
    const fetchCartData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call with a delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulate data from local storage or API
        const storedCart = localStorage.getItem('cart');
        const initialCart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];
        setCartItems(initialCart);
      } catch (err: any) {
        console.error("Error fetching cart data:", err);
        setError("Failed to load cart data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, []);

  useEffect(() => {
    // Save cart items to local storage whenever the cart changes
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItemToCart = (product: Product) => {
    try {
      const existingItemIndex = cartItems.findIndex((item) => item.id === product.id);

      if (existingItemIndex !== -1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        const newItem: CartItem = { ...product, quantity: 1 };
        setCartItems([...cartItems, newItem]);
      }
    } catch (err: any) {
      console.error("Error adding item to cart:", err);
      setError("Failed to add item to cart. Please try again.");
    }
  };

  const removeItemFromCart = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
    } catch (err: any) {
      console.error("Error removing item from cart:", err);
      setError("Failed to remove item from cart. Please try again.");
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      setError(err.message || "Failed to update quantity. Please try again.");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
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
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price} - Quantity: {item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItemFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${calculateTotal()}</p>
    </div>
  );
};

export default ShoppingCart;

// Example usage (for demonstration purposes)
const ExampleProduct: Product = {
  id: "product123",
  name: "Awesome Product",
  price: 25.00,
};

// You would typically pass this product data from a product listing page
// <ShoppingCart addItemToCart={addItemToCart} />

// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching cart data from local storage or an API
    const fetchCartData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call with a delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulate data from local storage or API
        const storedCart = localStorage.getItem('cart');
        const initialCart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];
        setCartItems(initialCart);
      } catch (err: any) {
        console.error("Error fetching cart data:", err);
        setError("Failed to load cart data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, []);

  useEffect(() => {
    // Save cart items to local storage whenever the cart changes
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItemToCart = (product: Product) => {
    try {
      const existingItemIndex = cartItems.findIndex((item) => item.id === product.id);

      if (existingItemIndex !== -1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        const newItem: CartItem = { ...product, quantity: 1 };
        setCartItems([...cartItems, newItem]);
      }
    } catch (err: any) {
      console.error("Error adding item to cart:", err);
      setError("Failed to add item to cart. Please try again.");
    }
  };

  const removeItemFromCart = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
    } catch (err: any) {
      console.error("Error removing item from cart:", err);
      setError("Failed to remove item from cart. Please try again.");
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      setError(err.message || "Failed to update quantity. Please try again.");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
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
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price} - Quantity: {item.quantity}
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItemFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${calculateTotal()}</p>
    </div>
  );
};

export default ShoppingCart;

// Example usage (for demonstration purposes)
const ExampleProduct: Product = {
  id: "product123",
  name: "Awesome Product",
  price: 25.00,
};

// You would typically pass this product data from a product listing page
// <ShoppingCart addItemToCart={addItemToCart} />