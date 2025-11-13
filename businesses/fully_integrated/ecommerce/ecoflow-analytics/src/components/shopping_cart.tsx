import React, { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Props {
  initialProducts: Product[];
}

const MyComponent: React.FC<Props> = ({ initialProducts }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number) => {
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart((prevCart) => [...prevCart, { product, quantity }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  return (
    <div role="shopping-cart">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.product.id}>
                {item.product.name} - {item.quantity} x ${item.product.price} = ${(item.product.price * item.quantity).toFixed(2)}
                <button onClick={() => removeFromCart(item.product.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <p>Total: ${getTotalPrice().toFixed(2)}</p>
        </>
      )}
      <button onClick={() => addToCart({ id: 1, name: 'Product 1', price: 10 }, 2)}>Add Product 1 (x2)</button>
    </div>
  );
};

export default MyComponent;

This updated component now stores the cart in local storage, allowing the cart to persist between sessions. It also handles adding and removing items from the cart, calculates the total price, and provides a better accessibility structure by using the `role` attribute for the shopping cart container. Additionally, it provides a button to add a specific product to the cart as an example of how to handle adding items dynamically.