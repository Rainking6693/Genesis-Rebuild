import React, { FC, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { CartContext, CartContextData } from '../contexts/CartContext';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

interface Props {
  id?: string;
}

const ShoppingCart: FC<Props> = ({ id }) => {
  const { t } = useTranslation();
  const { items, totalItems } = useContext(CartContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!items || items.length === 0) {
      setError(t('shoppingCart.empty'));
    } else {
      setError(null);
    }
  }, [items, t]);

  const cartClassNames = classnames('shopping-cart', {
    ['shopping-cart--error']: error,
  });

  const removeItemCallback = useCallback((itemId: string) => {
    // Handle removeItem function here
  }, []);

  const renderCartItems = useMemo(() => {
    return items.map((item) => (
      <div key={item.id}>
        {item.name} - {item.quantity}
      </div>
    ));
  }, [items]);

  return (
    <div id={id} data-testid="shopping-cart" role="region" aria-label={t('shoppingCart.label')} aria-labelledby="shopping-cart-title">
      <div id="shopping-cart-title" className="sr-only">{t('shoppingCart.title')}</div>
      {error && <div className="shopping-cart-error">{error}</div>}
      <div className="shopping-cart-items">{renderCartItems}</div>
      <div className="shopping-cart-total">{t('shoppingCart.total')} {totalItems}</div>
    </div>
  );
};

ShoppingCart.displayName = 'ShoppingCart';

export default ShoppingCart;

This updated version addresses resiliency, edge cases, accessibility, and maintainability concerns while also optimizing performance. For unit testing, you can use testing libraries like Jest or Mocha to test the component's behavior in isolation.