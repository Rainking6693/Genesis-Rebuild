import React, { FC, useContext, useEffect, useState } from 'react';
import { CartContext } from './CartContext';
import classnames from 'classnames';

interface Props {
  className?: string;
}

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const ShoppingCart: FC<Props> = ({ className }) => {
  const { cart, updateCart } = useContext(CartContext);
  const [cartState, setCartState] = useState<CartState>({ items: [], total: 0 });

  useEffect(() => {
    const total = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
    setCartState({ items: cart, total });
  }, [cart]);

  const increaseQuantity = (itemId: number) => {
    const updatedCart = cart.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  const decreaseQuantity = (itemId: number) => {
    const updatedCart = cart.map((item) =>
      item.id === itemId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateCart(updatedCart);
  };

  const removeItem = (itemId: number) => {
    const updatedCart = cart.filter((item) => item.id !== itemId);
    updateCart(updatedCart);
  };

  return (
    <div className={classnames('shopping-cart', className)}>
      <h2>Shopping Cart</h2>
      {cartState.items.length > 0 ? (
        <>
          <ul>
            {cartState.items.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price} x {item.quantity} = ${(item.quantity * item.price).toFixed(2)}
                <div className="actions">
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                  <button onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div>
            Total: ${cartState.total.toFixed(2)}
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default ShoppingCart;

import React, { FC, useContext, useEffect, useState } from 'react';
import { CartContext } from './CartContext';
import classnames from 'classnames';

interface Props {
  className?: string;
}

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const ShoppingCart: FC<Props> = ({ className }) => {
  const { cart, updateCart } = useContext(CartContext);
  const [cartState, setCartState] = useState<CartState>({ items: [], total: 0 });

  useEffect(() => {
    const total = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
    setCartState({ items: cart, total });
  }, [cart]);

  const increaseQuantity = (itemId: number) => {
    const updatedCart = cart.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updatedCart);
  };

  const decreaseQuantity = (itemId: number) => {
    const updatedCart = cart.map((item) =>
      item.id === itemId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateCart(updatedCart);
  };

  const removeItem = (itemId: number) => {
    const updatedCart = cart.filter((item) => item.id !== itemId);
    updateCart(updatedCart);
  };

  return (
    <div className={classnames('shopping-cart', className)}>
      <h2>Shopping Cart</h2>
      {cartState.items.length > 0 ? (
        <>
          <ul>
            {cartState.items.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price} x {item.quantity} = ${(item.quantity * item.price).toFixed(2)}
                <div className="actions">
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                  <button onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div>
            Total: ${cartState.total.toFixed(2)}
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default ShoppingCart;