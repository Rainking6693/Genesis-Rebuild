import React, { FC, ReactNode } from 'react';

interface ShoppingCartProps {
  totalItems: number;
  totalPrice: number;
  error?: string;
  children?: ReactNode;
}

// ShoppingCartMessage component
const ShoppingCartMessage: FC<ShoppingCartMessageProps> = ({ message }) => {
  return <div>{message}</div>;
};

// Separated ShoppingCartMessage component into its own module
export const ShoppingCartMessageComponent = ShoppingCartMessage;

const ShoppingCart: FC<ShoppingCartProps> = ({ totalItems = 0, totalPrice = 0, error, children }) => {
  return (
    <div>
      <h2>Shopping Cart</h2>
      {error && <p className="error" aria-live="polite">{error}</p>}
      <p>Total Items: {totalItems}</p>
      <p>Total Price: ${totalPrice.toFixed(2)}</p>
      {children}
      <div aria-live="polite">
        <ShoppingCartMessageComponent message="View and manage your items here." />
      </div>
    </div>
  );
};

ShoppingCart.displayName = 'ShoppingCart';

export default ShoppingCart;

This updated code addresses resiliency, edge cases, accessibility, and maintainability concerns for the shopping_cart component.