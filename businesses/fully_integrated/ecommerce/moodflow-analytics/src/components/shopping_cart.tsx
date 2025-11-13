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
      const updatedProduct = products[productIndex];
      setTotalPrice(totalPrice - updatedProduct.price * updatedProduct.quantity);
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      <ul>
        {cartItems.map((item) => (
          <CartItem key={item.id} product={item} onRemove={removeFromCart} />
        ))}
      </ul>
      <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
      <button onClick={() => alert('Checkout')}>Checkout</button>
    </div>
  );
};

interface CartItemProps {
  product: Product;
  onRemove: (product: Product) => void;
}

const CartItem: React.FC<CartItemProps> = ({ product, onRemove }) => {
  const handleRemove = () => {
    onRemove(product);
  };

  return (
    <li>
      <span>{product.name}</span>
      <span>{product.quantity}</span>
      <span>${product.price.toFixed(2)}</span>
      <button onClick={handleRemove}>Remove</button>
    </li>
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
      const updatedProduct = products[productIndex];
      setTotalPrice(totalPrice - updatedProduct.price * updatedProduct.quantity);
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      <ul>
        {cartItems.map((item) => (
          <CartItem key={item.id} product={item} onRemove={removeFromCart} />
        ))}
      </ul>
      <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
      <button onClick={() => alert('Checkout')}>Checkout</button>
    </div>
  );
};

interface CartItemProps {
  product: Product;
  onRemove: (product: Product) => void;
}

const CartItem: React.FC<CartItemProps> = ({ product, onRemove }) => {
  const handleRemove = () => {
    onRemove(product);
  };

  return (
    <li>
      <span>{product.name}</span>
      <span>{product.quantity}</span>
      <span>${product.price.toFixed(2)}</span>
      <button onClick={handleRemove}>Remove</button>
    </li>
  );
};

export default ShoppingCart;