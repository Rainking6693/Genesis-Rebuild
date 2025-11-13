// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  // Add any necessary props here, e.g., API endpoint for fetching cart data
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: any, errorInfo: any) => {
      console.error("Caught an error: ", error, errorInfo);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      <div>
        <h2>Something went wrong.</h2>
        <details style={{ whiteSpace: 'pre-wrap' }}>
          {/* Display error details here if available */}
        </details>
      </div>
    );
  }

  return children;
}

function ShoppingCart(props: ShoppingCartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Example: Fetch cart data from an API (replace with your actual API call)
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        // Simulate API call
        const data: CartItem[] = [
          { id: '1', name: 'Product A', price: 20, quantity: 1 },
          { id: '2', name: 'Product B', price: 30, quantity: 2 },
        ];
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        // Handle error appropriately, e.g., display an error message to the user
      }
    };

    fetchCartData();
  }, []);

  useEffect(() => {
    // Calculate total price whenever cartItems change
    const newTotalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(newTotalPrice);
  }, [cartItems]);

  const handleAddItem = (item: CartItem) => {
    try {
      const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

      if (existingItemIndex !== -1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        setCartItems([...cartItems, { ...item, quantity: 1 }]);
      }
    } catch (error) {
      console.error("Error adding item:", error);
      // Handle error appropriately
    }
  };

  const handleRemoveItem = (itemId: string) => {
    try {
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Error removing item:", error);
      // Handle error appropriately
    }
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      const updatedCartItems = cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error("Error updating quantity:", error);
      // Handle error appropriately, e.g., display an error message to the user
    }
  };

  return (
    <ErrorBoundary>
      <div>
        <h2>Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price} x {item.quantity}
                <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
                <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                  +
                </button>
                <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                  -
                </button>
              </li>
            ))}
          </ul>
        )}
        <p>Total: ${totalPrice}</p>
        {/* Add checkout button or other relevant UI elements */}
      </div>
    </ErrorBoundary>
  );
}

export default ShoppingCart;