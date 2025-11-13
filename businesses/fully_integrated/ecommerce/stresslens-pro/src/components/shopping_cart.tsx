import React, { FC, useContext, useEffect, useState } from 'react';
import { ShoppingCartContext } from './ShoppingCartContext';
import classnames from 'classnames';

interface Props {
  className?: string;
}

interface CartItem {
  id: number;
  name: string;
  quantity: number;
}

interface CartContextData {
  cartItems: CartItem[];
  addToCart: (itemId: number) => void;
  removeFromCart: (itemId: number) => void;
}

const MyComponent: FC<Props> = ({ className }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(ShoppingCartContext);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    setCartItemCount(cartItems.reduce((acc, item) => acc + item.quantity, 0));
  }, [cartItems]);

  const handleAddToCart = (itemId: number) => {
    addToCart(itemId);
  };

  const handleRemoveFromCart = (itemId: number) => {
    removeFromCart(itemId);
  };

  return (
    <div className={classnames('shopping-cart', className)}>
      <h2>Your Shopping Cart</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.name} ({item.quantity})
            <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <div>
        Total Items: {cartItemCount}
      </div>
      <button onClick={() => window.alert('Checkout')}>Checkout</button>
    </div>
  );
};

export default MyComponent;

import React, { FC, useContext, useEffect, useState } from 'react';
import { ShoppingCartContext } from './ShoppingCartContext';
import classnames from 'classnames';

interface Props {
  className?: string;
}

interface CartItem {
  id: number;
  name: string;
  quantity: number;
}

interface CartContextData {
  cartItems: CartItem[];
  addToCart: (itemId: number) => void;
  removeFromCart: (itemId: number) => void;
}

const MyComponent: FC<Props> = ({ className }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(ShoppingCartContext);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    setCartItemCount(cartItems.reduce((acc, item) => acc + item.quantity, 0));
  }, [cartItems]);

  const handleAddToCart = (itemId: number) => {
    addToCart(itemId);
  };

  const handleRemoveFromCart = (itemId: number) => {
    removeFromCart(itemId);
  };

  return (
    <div className={classnames('shopping-cart', className)}>
      <h2>Your Shopping Cart</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.name} ({item.quantity})
            <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <div>
        Total Items: {cartItemCount}
      </div>
      <button onClick={() => window.alert('Checkout')}>Checkout</button>
    </div>
  );
};

export default MyComponent;