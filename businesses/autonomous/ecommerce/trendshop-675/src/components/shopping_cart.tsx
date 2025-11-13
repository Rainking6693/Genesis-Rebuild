// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  // Add any necessary props here
}

const ShoppingCart: React.FC<ShoppingCartProps> = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
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
              { id: '1', name: 'Product A', price: 20, quantity: 2 },
              { id: '2', name: 'Product B', price: 30, quantity: 1 },
            ]);
          }, 500); // Simulate API latency
        });

        setCartItems(response);
      } catch (err: any) {
        console.error("Error fetching cart items:", err);
        setError("Failed to load cart items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    // Calculate total price whenever cart items change
    const newTotalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(newTotalPrice);
  }, [cartItems]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      setError("Quantity cannot be negative.");
      return;
    }
    try {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      setError("Failed to update quantity. Please try again.");
    }
  };

  const handleRemoveItem = (itemId: string) => {
    try {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error("Error removing item:", err);
      setError("Failed to remove item. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading cart...</div>;
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
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price} x
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
              />
              <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${totalPrice}</p>
    </div>
  );
};

export default ShoppingCart;