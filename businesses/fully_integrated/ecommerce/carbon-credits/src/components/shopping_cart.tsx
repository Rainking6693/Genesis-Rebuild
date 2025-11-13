import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  className?: string;
}

const ShoppingCart: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      let fetchedCartItems = 0;
      try {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          fetchedCartItems = data.items.length;
        } else {
          setError(await response.text());
        }
      } catch (error) {
        setError(error.message);
      }
      setCartItems(fetchedCartItems);
    };

    fetchCartItems();
  }, []);

  const message = cartItems > 0 ? t('shopping_cart.message_with_items', { count: cartItems }) : t('shopping_cart.message_no_items');

  return (
    <div className={className}>
      {error && <div className="error">{error}</div>}
      {message}
      <button onClick={() => window.location.href = '/cart'}>{t('shopping_cart.view_cart')}</button>
    </div>
  );
};

export default ShoppingCart;

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  className?: string;
}

const ShoppingCart: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      let fetchedCartItems = 0;
      try {
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          fetchedCartItems = data.items.length;
        } else {
          setError(await response.text());
        }
      } catch (error) {
        setError(error.message);
      }
      setCartItems(fetchedCartItems);
    };

    fetchCartItems();
  }, []);

  const message = cartItems > 0 ? t('shopping_cart.message_with_items', { count: cartItems }) : t('shopping_cart.message_no_items');

  return (
    <div className={className}>
      {error && <div className="error">{error}</div>}
      {message}
      <button onClick={() => window.location.href = '/cart'}>{t('shopping_cart.view_cart')}</button>
    </div>
  );
};

export default ShoppingCart;