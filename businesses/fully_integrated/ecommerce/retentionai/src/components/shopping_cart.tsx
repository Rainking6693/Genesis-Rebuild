import React, { useState, useCallback } from 'react';

interface ShoppingCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  initialCartItems?: ShoppingCartItem[];
  maxQuantity?: number;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ initialCartItems = [], maxQuantity = 10 }) => {
  const [cartItems, setCartItems] = useState<ShoppingCartItem[]>(initialCartItems);

  const handleIncrement = useCallback(
    (itemId: string) => {
      setCartItems((prevItems) => {
        const itemToUpdate = prevItems.find((item) => item.id === itemId);

        if (!itemToUpdate) {
          console.warn(`Item with id ${itemId} not found in cart.`);
          return prevItems; // Return the previous state if the item isn't found
        }

        if (itemToUpdate.quantity >= maxQuantity) {
          // Optionally display a message to the user that the maximum quantity has been reached
          return prevItems;
        }

        return prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      });
    },
    [maxQuantity]
  );

  const handleDecrement = useCallback(
    (itemId: string) => {
      setCartItems((prevItems) => {
        const itemToUpdate = prevItems.find((item) => item.id === itemId);

        if (!itemToUpdate) {
          console.warn(`Item with id ${itemId} not found in cart.`);
          return prevItems; // Return the previous state if the item isn't found
        }

        if (itemToUpdate.quantity <= 1) {
          // Optionally remove the item from the cart or prevent decrementing below 1
          return prevItems.map((item) =>
            item.id === itemId ? { ...item, quantity: 1 } : item
          );
        }

        return prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      });
    },
    []
  );

  const handleRemove = useCallback((itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  const calculateTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const isCartEmpty = cartItems.length === 0;

  return (
    <div aria-label="Shopping Cart">
      <h2>Shopping Cart</h2>

      {isCartEmpty ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id} aria-label={`Item: ${item.name}, Quantity: ${item.quantity}`}>
              <span>{item.name}</span>
              <span>Price: ${item.price.toFixed(2)}</span>
              <div>
                <button
                  onClick={() => handleDecrement(item.id)}
                  aria-label={`Decrease quantity of ${item.name}`}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleIncrement(item.id)}
                  aria-label={`Increase quantity of ${item.name}`}
                  disabled={item.quantity >= maxQuantity}
                >
                  +
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div aria-label="Cart Total">
        <strong>Total: ${calculateTotal().toFixed(2)}</strong>
      </div>
    </div>
  );
};

export default ShoppingCart;

import React, { useState, useCallback } from 'react';

interface ShoppingCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  initialCartItems?: ShoppingCartItem[];
  maxQuantity?: number;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ initialCartItems = [], maxQuantity = 10 }) => {
  const [cartItems, setCartItems] = useState<ShoppingCartItem[]>(initialCartItems);

  const handleIncrement = useCallback(
    (itemId: string) => {
      setCartItems((prevItems) => {
        const itemToUpdate = prevItems.find((item) => item.id === itemId);

        if (!itemToUpdate) {
          console.warn(`Item with id ${itemId} not found in cart.`);
          return prevItems; // Return the previous state if the item isn't found
        }

        if (itemToUpdate.quantity >= maxQuantity) {
          // Optionally display a message to the user that the maximum quantity has been reached
          return prevItems;
        }

        return prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      });
    },
    [maxQuantity]
  );

  const handleDecrement = useCallback(
    (itemId: string) => {
      setCartItems((prevItems) => {
        const itemToUpdate = prevItems.find((item) => item.id === itemId);

        if (!itemToUpdate) {
          console.warn(`Item with id ${itemId} not found in cart.`);
          return prevItems; // Return the previous state if the item isn't found
        }

        if (itemToUpdate.quantity <= 1) {
          // Optionally remove the item from the cart or prevent decrementing below 1
          return prevItems.map((item) =>
            item.id === itemId ? { ...item, quantity: 1 } : item
          );
        }

        return prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      });
    },
    []
  );

  const handleRemove = useCallback((itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  const calculateTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const isCartEmpty = cartItems.length === 0;

  return (
    <div aria-label="Shopping Cart">
      <h2>Shopping Cart</h2>

      {isCartEmpty ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id} aria-label={`Item: ${item.name}, Quantity: ${item.quantity}`}>
              <span>{item.name}</span>
              <span>Price: ${item.price.toFixed(2)}</span>
              <div>
                <button
                  onClick={() => handleDecrement(item.id)}
                  aria-label={`Decrease quantity of ${item.name}`}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleIncrement(item.id)}
                  aria-label={`Increase quantity of ${item.name}`}
                  disabled={item.quantity >= maxQuantity}
                >
                  +
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div aria-label="Cart Total">
        <strong>Total: ${calculateTotal().toFixed(2)}</strong>
      </div>
    </div>
  );
};

export default ShoppingCart;