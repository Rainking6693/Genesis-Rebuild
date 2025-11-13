import React, { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  products: Product[];
}

interface ShoppingCartState {
  cartItems: Product[];
  totalPrice: number;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ products }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const updatedCartItems = products.filter((product) => cartItems.some((item) => item.id === product.id));
    setCartItems(updatedCartItems);
    let updatedTotalPrice = 0;
    updatedCartItems.forEach((item) => {
      updatedTotalPrice += item.price * item.quantity;
    });
    setTotalPrice(updatedTotalPrice);
  }, [products]);

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }

    setTotalPrice(totalPrice + product.price);
  };

  const removeFromCart = (product: Product) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== product.id);
    setCartItems(updatedCartItems);

    const productIndex = products.findIndex((item) => item.id === product.id);
    if (productIndex !== -1) {
      setTotalPrice(totalPrice - products[productIndex].price);
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length > 0 ? (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                <button onClick={() => removeFromCart(item)}>Remove</button>
              </li>
            ))}
          </ul>
          <div>Total: ${totalPrice.toFixed(2)}</div>
        </>
      ) : (
        <div>Your cart is empty.</div>
      )}
      <h3>Products</h3>
      {products.map((product) => (
        <div key={product.id}>
          {product.name} - ${product.price}
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default ShoppingCart;

import React, { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  products: Product[];
}

interface ShoppingCartState {
  cartItems: Product[];
  totalPrice: number;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ products }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const updatedCartItems = products.filter((product) => cartItems.some((item) => item.id === product.id));
    setCartItems(updatedCartItems);
    let updatedTotalPrice = 0;
    updatedCartItems.forEach((item) => {
      updatedTotalPrice += item.price * item.quantity;
    });
    setTotalPrice(updatedTotalPrice);
  }, [products]);

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }

    setTotalPrice(totalPrice + product.price);
  };

  const removeFromCart = (product: Product) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== product.id);
    setCartItems(updatedCartItems);

    const productIndex = products.findIndex((item) => item.id === product.id);
    if (productIndex !== -1) {
      setTotalPrice(totalPrice - products[productIndex].price);
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length > 0 ? (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                <button onClick={() => removeFromCart(item)}>Remove</button>
              </li>
            ))}
          </ul>
          <div>Total: ${totalPrice.toFixed(2)}</div>
        </>
      ) : (
        <div>Your cart is empty.</div>
      )}
      <h3>Products</h3>
      {products.map((product) => (
        <div key={product.id}>
          {product.name} - ${product.price}
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default ShoppingCart;