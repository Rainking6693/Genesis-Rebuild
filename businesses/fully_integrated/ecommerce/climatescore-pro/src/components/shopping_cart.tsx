import React, { useState, useCallback, useMemo, useEffect } from 'react';

interface ShoppingCartProps {
  initialCount?: number;
  itemName: string;
  price: number;
  maxQuantity?: number; // Optional prop to limit the maximum quantity
  onQuantityChange?: (newQuantity: number) => void; // Callback for quantity changes
  currency?: string; // Optional prop for currency symbol, default to USD
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  initialCount = 0,
  itemName,
  price,
  maxQuantity,
  onQuantityChange,
  currency = '$',
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [internalPrice, setInternalPrice] = useState<number>(price); // Use internal state for price after validation
  const [internalInitialCount, setInternalInitialCount] = useState<number>(initialCount);

  // Prop validation with useEffect to avoid blocking initial render
  useEffect(() => {
    if (typeof price !== 'number' || isNaN(price) || price < 0) {
      console.error('Invalid price provided to ShoppingCart component. Setting to 0.');
      setInternalPrice(0);
    } else {
      setInternalPrice(price);
    }

    if (typeof initialCount !== 'number' || isNaN(initialCount) || initialCount < 0) {
      console.warn('Invalid initialCount provided. Defaulting to 0.');
      setInternalInitialCount(0);
      setCount(0); // Also update the count state
    } else {
      setInternalInitialCount(initialCount);
      setCount(initialCount);
    }
  }, [price, initialCount]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      if (maxQuantity !== undefined && prevCount >= maxQuantity) {
        return prevCount; // Don't increment if it exceeds maxQuantity
      }
      const newCount = prevCount + 1;
      onQuantityChange?.(newCount); // Call the callback if it exists
      return newCount;
    });
  }, [maxQuantity, onQuantityChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount > 0 ? prevCount - 1 : 0;
      onQuantityChange?.(newCount); // Call the callback if it exists
      return newCount;
    });
  }, [onQuantityChange]);

  const totalCost = useMemo(() => count * internalPrice, [count, internalPrice]);

  const formattedPrice = useMemo(() => internalPrice.toFixed(2), [internalPrice]);
  const formattedTotalCost = useMemo(() => totalCost.toFixed(2), [totalCost]);

  const isIncrementDisabled = useMemo(() => maxQuantity !== undefined && count >= maxQuantity, [count, maxQuantity]);

  // Accessibility improvements:  Use semantic elements and ARIA attributes
  return (
    <div className="shopping-cart" aria-label={`Shopping cart for ${itemName}`}>
      <h3 className="shopping-cart__item-name">{itemName}</h3>
      <div className="shopping-cart__quantity">
        <label htmlFor="quantity">Quantity:</label>
        <span id="quantity" aria-live="polite" className="shopping-cart__quantity-value">{count}</span>
      </div>
      <p className="shopping-cart__price">Price: {currency}{formattedPrice}</p>
      <p className="shopping-cart__total">Total: {currency}{formattedTotalCost}</p>

      <div className="shopping-cart__actions">
        <button
          onClick={increment}
          disabled={isIncrementDisabled}
          aria-label={`Add ${itemName} to cart`}
          className="shopping-cart__button shopping-cart__button--add"
        >
          Add to Cart
        </button>
        <button
          onClick={decrement}
          disabled={count === 0}
          aria-label={`Remove ${itemName} from cart`}
          className="shopping-cart__button shopping-cart__button--remove"
        >
          Remove from Cart
        </button>
      </div>

      {isIncrementDisabled && (
        <div className="shopping-cart__max-quantity-alert" aria-live="polite" role="alert">
          Maximum quantity reached.
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;

import React, { useState, useCallback, useMemo, useEffect } from 'react';

interface ShoppingCartProps {
  initialCount?: number;
  itemName: string;
  price: number;
  maxQuantity?: number; // Optional prop to limit the maximum quantity
  onQuantityChange?: (newQuantity: number) => void; // Callback for quantity changes
  currency?: string; // Optional prop for currency symbol, default to USD
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  initialCount = 0,
  itemName,
  price,
  maxQuantity,
  onQuantityChange,
  currency = '$',
}) => {
  const [count, setCount] = useState<number>(initialCount);
  const [internalPrice, setInternalPrice] = useState<number>(price); // Use internal state for price after validation
  const [internalInitialCount, setInternalInitialCount] = useState<number>(initialCount);

  // Prop validation with useEffect to avoid blocking initial render
  useEffect(() => {
    if (typeof price !== 'number' || isNaN(price) || price < 0) {
      console.error('Invalid price provided to ShoppingCart component. Setting to 0.');
      setInternalPrice(0);
    } else {
      setInternalPrice(price);
    }

    if (typeof initialCount !== 'number' || isNaN(initialCount) || initialCount < 0) {
      console.warn('Invalid initialCount provided. Defaulting to 0.');
      setInternalInitialCount(0);
      setCount(0); // Also update the count state
    } else {
      setInternalInitialCount(initialCount);
      setCount(initialCount);
    }
  }, [price, initialCount]);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      if (maxQuantity !== undefined && prevCount >= maxQuantity) {
        return prevCount; // Don't increment if it exceeds maxQuantity
      }
      const newCount = prevCount + 1;
      onQuantityChange?.(newCount); // Call the callback if it exists
      return newCount;
    });
  }, [maxQuantity, onQuantityChange]);

  const decrement = useCallback(() => {
    setCount((prevCount) => {
      const newCount = prevCount > 0 ? prevCount - 1 : 0;
      onQuantityChange?.(newCount); // Call the callback if it exists
      return newCount;
    });
  }, [onQuantityChange]);

  const totalCost = useMemo(() => count * internalPrice, [count, internalPrice]);

  const formattedPrice = useMemo(() => internalPrice.toFixed(2), [internalPrice]);
  const formattedTotalCost = useMemo(() => totalCost.toFixed(2), [totalCost]);

  const isIncrementDisabled = useMemo(() => maxQuantity !== undefined && count >= maxQuantity, [count, maxQuantity]);

  // Accessibility improvements:  Use semantic elements and ARIA attributes
  return (
    <div className="shopping-cart" aria-label={`Shopping cart for ${itemName}`}>
      <h3 className="shopping-cart__item-name">{itemName}</h3>
      <div className="shopping-cart__quantity">
        <label htmlFor="quantity">Quantity:</label>
        <span id="quantity" aria-live="polite" className="shopping-cart__quantity-value">{count}</span>
      </div>
      <p className="shopping-cart__price">Price: {currency}{formattedPrice}</p>
      <p className="shopping-cart__total">Total: {currency}{formattedTotalCost}</p>

      <div className="shopping-cart__actions">
        <button
          onClick={increment}
          disabled={isIncrementDisabled}
          aria-label={`Add ${itemName} to cart`}
          className="shopping-cart__button shopping-cart__button--add"
        >
          Add to Cart
        </button>
        <button
          onClick={decrement}
          disabled={count === 0}
          aria-label={`Remove ${itemName} from cart`}
          className="shopping-cart__button shopping-cart__button--remove"
        >
          Remove from Cart
        </button>
      </div>

      {isIncrementDisabled && (
        <div className="shopping-cart__max-quantity-alert" aria-live="polite" role="alert">
          Maximum quantity reached.
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;