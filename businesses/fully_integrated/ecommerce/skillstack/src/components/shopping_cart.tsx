import React, { FC, ReactNode, PropsWithChildren } from 'react';

interface ShoppingCartProps {
  totalItems: number;
  totalPrice: number;
  children?: ReactNode;
}

interface ShoppingCartMessageProps {
  id?: string; // Adding an optional id for accessibility purposes
  message: string;
}

const ShoppingCartMessage: FC<ShoppingCartMessageProps> = ({ id, message }) => {
  return (
    <div id={id} role="alert" aria-live="assertive">
      {message}
    </div>
  );
};

const ShoppingCart: FC<ShoppingCartProps> = ({ totalItems, totalPrice, children }) => {
  return (
    <div>
      <h2>Your Shopping Cart</h2>
      <p>Total Items: {totalItems}</p>
      <p>Total Price: ${totalPrice}</p>
      {children}
    </div>
  );
};

ShoppingCart.defaultProps = {
  children: (
    <ShoppingCartMessage id="cart-message" message="View and manage your items here." />
  ),
};

ShoppingCart.displayName = 'ShoppingCart';

export default ShoppingCart;

import React, { FC, ReactNode, PropsWithChildren } from 'react';

interface ShoppingCartProps {
  totalItems: number;
  totalPrice: number;
  children?: ReactNode;
}

interface ShoppingCartMessageProps {
  id?: string; // Adding an optional id for accessibility purposes
  message: string;
}

const ShoppingCartMessage: FC<ShoppingCartMessageProps> = ({ id, message }) => {
  return (
    <div id={id} role="alert" aria-live="assertive">
      {message}
    </div>
  );
};

const ShoppingCart: FC<ShoppingCartProps> = ({ totalItems, totalPrice, children }) => {
  return (
    <div>
      <h2>Your Shopping Cart</h2>
      <p>Total Items: {totalItems}</p>
      <p>Total Price: ${totalPrice}</p>
      {children}
    </div>
  );
};

ShoppingCart.defaultProps = {
  children: (
    <ShoppingCartMessage id="cart-message" message="View and manage your items here." />
  ),
};

ShoppingCart.displayName = 'ShoppingCart';

export default ShoppingCart;