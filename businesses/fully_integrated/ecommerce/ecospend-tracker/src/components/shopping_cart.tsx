import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface ShoppingCartProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
  isEmpty?: boolean;
}

const ShoppingCart: FC<ShoppingCartProps> = ({ className, message, children, isEmpty, ...rest }) => {
  const classes = `shopping-cart-message ${className || ''}`;

  return (
    <div className={classes} {...rest}>
      {isEmpty && !children && <p className="empty-cart-message">Your shopping cart is empty.</p>}
      {message || children}
    </div>
  );
};

ShoppingCart.displayName = 'ShoppingCart';

export default ShoppingCart;

import React, { FC, DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

interface ShoppingCartProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
  isEmpty?: boolean;
}

const ShoppingCart: FC<ShoppingCartProps> = ({ className, message, children, isEmpty, ...rest }) => {
  const classes = `shopping-cart-message ${className || ''}`;

  return (
    <div className={classes} {...rest}>
      {isEmpty && !children && <p className="empty-cart-message">Your shopping cart is empty.</p>}
      {message || children}
    </div>
  );
};

ShoppingCart.displayName = 'ShoppingCart';

export default ShoppingCart;