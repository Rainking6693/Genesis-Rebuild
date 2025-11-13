import React, { FC, ReactNode, Key } from 'react';

interface ShoppingCartProps {
  totalItems: number;
  totalPrice: number;
  onCheckout?: () => void;
  error?: string;
  children?: ReactNode;
}

interface ShoppingCartMessageProps {
  key: Key;
  message: string;
}

const ShoppingCartMessage: FC<ShoppingCartMessageProps> = ({ key, message }) => {
  return <div key={key} className="message">{message}</div>;
};

const ShoppingCart: FC<ShoppingCartProps> = ({ totalItems, totalPrice, onCheckout, error, children }) => {
  const handleCheckout = () => {
    if (typeof onCheckout === 'function') {
      onCheckout();
    }
  };

  return (
    <div className="shopping-cart" role="group">
      <h2>Your Shopping Cart</h2>
      {error && <div className="error">{error}</div>}
      {totalItems !== undefined && totalPrice !== undefined && (
        <>
          <p>Total Items: {totalItems}</p>
          <p>Total Price: ${totalPrice.toFixed(2)}</p>
        </>
      )}
      {onCheckout && (
        <button onClick={handleCheckout} role="button">
          Checkout
        </button>
      )}
      {children}
      <ShoppingCartMessage key="checkout-message" message="Click 'Checkout' to proceed with your purchase." />
    </div>
  );
};

ShoppingCart.defaultProps = {
  onCheckout: undefined,
  error: undefined,
};

export default ShoppingCart;

This updated code addresses the points you mentioned and adds additional improvements for resiliency, edge cases, and accessibility.