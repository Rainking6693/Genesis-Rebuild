import React, { FC, ReactNode, useRef, useState } from 'react';

interface ShoppingCartProps {
  totalItems: number;
  totalPrice: number;
  error?: string;
  children?: ReactNode;
}

interface ShoppingCartMessageProps {
  message: string;
}

const ShoppingCartMessage: FC<ShoppingCartMessageProps> = ({ message }) => {
  return <div role="alert">{message}</div>;
};

const ShoppingCart: FC<ShoppingCartProps> = ({ totalItems, totalPrice, error, children }) => {
  const shoppingCartRef = useRef<HTMLDivElement>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (shoppingCartRef.current && !shoppingCartRef.current.contains(event.target as Node)) {
      setIsCartOpen(false);
    }
  };

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => handleClickOutside(event);
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <div ref={shoppingCartRef} role="region" aria-labelledby="shopping-cart-title" aria-describedby={error ? "shopping-cart-error" : undefined}>
      <button aria-expanded={isCartOpen ? 'true' : 'false'} aria-controls="shopping-cart-content" onClick={() => setIsCartOpen(!isCartOpen)}>
        View Cart
      </button>
      {isCartOpen && (
        <div id="shopping-cart-content" role="list">
          {/* Add your cart items here */}
          <ShoppingCartMessage message="You have {totalItems} items in your cart." />
          <p>Total Price: ${totalPrice.toFixed(2)}</p>
          {children}
        </div>
      )}
      {error && <p id="shopping-cart-error" role="alert">{error}</p>}
      <h2 id="shopping-cart-title">Shopping Cart</h2>
    </div>
  );
};

export default ShoppingCart;

import React, { FC, ReactNode, useRef, useState } from 'react';

interface ShoppingCartProps {
  totalItems: number;
  totalPrice: number;
  error?: string;
  children?: ReactNode;
}

interface ShoppingCartMessageProps {
  message: string;
}

const ShoppingCartMessage: FC<ShoppingCartMessageProps> = ({ message }) => {
  return <div role="alert">{message}</div>;
};

const ShoppingCart: FC<ShoppingCartProps> = ({ totalItems, totalPrice, error, children }) => {
  const shoppingCartRef = useRef<HTMLDivElement>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (shoppingCartRef.current && !shoppingCartRef.current.contains(event.target as Node)) {
      setIsCartOpen(false);
    }
  };

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => handleClickOutside(event);
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <div ref={shoppingCartRef} role="region" aria-labelledby="shopping-cart-title" aria-describedby={error ? "shopping-cart-error" : undefined}>
      <button aria-expanded={isCartOpen ? 'true' : 'false'} aria-controls="shopping-cart-content" onClick={() => setIsCartOpen(!isCartOpen)}>
        View Cart
      </button>
      {isCartOpen && (
        <div id="shopping-cart-content" role="list">
          {/* Add your cart items here */}
          <ShoppingCartMessage message="You have {totalItems} items in your cart." />
          <p>Total Price: ${totalPrice.toFixed(2)}</p>
          {children}
        </div>
      )}
      {error && <p id="shopping-cart-error" role="alert">{error}</p>}
      <h2 id="shopping-cart-title">Shopping Cart</h2>
    </div>
  );
};

export default ShoppingCart;