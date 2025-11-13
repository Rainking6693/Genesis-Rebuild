import React, { useState, useCallback, useEffect, useRef } from 'react';

interface ShoppingCartProps {
  initialQuantity?: number;
  productId: string; // Unique identifier for the product
  productName: string; // Name of the product
  price: number; // Price of the product
  maxQuantity?: number; // Maximum allowable quantity.  Optional.
  onQuantityChange?: (productId: string, newQuantity: number) => void; // Callback for quantity changes
  currency?: string; // Currency symbol, defaults to USD
  minQuantity?: number; // Minimum allowable quantity. Optional, defaults to 0.
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  initialQuantity = 0,
  productId,
  productName,
  price,
  maxQuantity,
  onQuantityChange,
  currency = '$',
  minQuantity = 0,
}) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [inputValue, setInputValue] = useState<string>(String(initialQuantity));
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset quantity and input value when initialQuantity changes
    setQuantity(initialQuantity);
    setInputValue(String(initialQuantity));
    setError(null); // Clear any previous errors
  }, [initialQuantity]);

  const validateQuantity = (value: number): number => {
    let newValue = value;

    if (isNaN(newValue)) {
      setError('Invalid quantity');
      return quantity; // Revert to the last valid quantity
    }

    if (newValue < minQuantity) {
      newValue = minQuantity;
      setError(`Minimum quantity is ${minQuantity}`);
    } else if (maxQuantity !== undefined && newValue > maxQuantity) {
      newValue = maxQuantity;
      setError(`Maximum quantity is ${maxQuantity}`);
    } else {
      setError(null); // Clear any previous errors
    }

    return newValue;
  };

  const increment = useCallback(() => {
    setQuantity((prevQuantity) => {
      const newQuantity = maxQuantity !== undefined ? Math.min(prevQuantity + 1, maxQuantity) : prevQuantity + 1;
      if (newQuantity !== prevQuantity) {
        const validatedQuantity = validateQuantity(newQuantity);
        if (validatedQuantity !== newQuantity) {
          return prevQuantity; // Revert if validation fails
        }
        onQuantityChange?.(productId, newQuantity);
        setInputValue(String(newQuantity));
        return newQuantity;
      }
      return prevQuantity;
    });
  }, [productId, onQuantityChange, maxQuantity, validateQuantity]);

  const decrement = useCallback(() => {
    setQuantity((prevQuantity) => {
      const newQuantity = Math.max(minQuantity, prevQuantity - 1);
      if (newQuantity !== prevQuantity) {
        const validatedQuantity = validateQuantity(newQuantity);
        if (validatedQuantity !== newQuantity) {
          return prevQuantity; // Revert if validation fails
        }
        onQuantityChange?.(productId, newQuantity);
        setInputValue(String(newQuantity));
        return newQuantity;
      }
      return prevQuantity;
    });
  }, [productId, onQuantityChange, minQuantity, validateQuantity]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    const newValue = parseInt(value, 10);

    const validatedQuantity = validateQuantity(newValue);

    if (!isNaN(newValue) && validatedQuantity === newValue) {
      setQuantity(newValue);
      onQuantityChange?.(productId, newValue);
    }
  }, [productId, onQuantityChange, maxQuantity, minQuantity, validateQuantity]);

  const handleBlur = useCallback(() => {
    const parsedValue = parseInt(inputValue, 10);
    const validatedQuantity = validateQuantity(parsedValue);

    setQuantity(validatedQuantity);
    setInputValue(String(validatedQuantity));
  }, [inputValue, validateQuantity]);

  const subtotal = price * quantity;

  const incrementButtonDisabled = maxQuantity !== undefined && quantity >= maxQuantity;
  const decrementButtonDisabled = quantity <= minQuantity;

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
      <p>Product: {productName}</p>
      <p>Price: {currency}{price.toFixed(2)}</p>
      <div>
        <button
          onClick={decrement}
          aria-label={`Decrement quantity of ${productName}`}
          disabled={decrementButtonDisabled}
        >
          -
        </button>
        <input
          ref={inputRef}
          type="number"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          min={String(minQuantity)}
          max={maxQuantity !== undefined ? String(maxQuantity) : undefined}
          style={{ width: '50px', textAlign: 'center' }}
          aria-label={`Quantity of ${productName}`}
          inputMode="numeric" //  For mobile keyboards
        />
        <button
          onClick={increment}
          aria-label={`Increment quantity of ${productName}`}
          disabled={incrementButtonDisabled}
        >
          +
        </button>
      </div>
      <p>Subtotal: {currency}{subtotal.toFixed(2)}</p>
      {error && <p style={{ color: 'red', fontSize: '0.8em' }}>{error}</p>}
      {maxQuantity !== undefined && quantity >= maxQuantity && !error && (
        <p style={{ color: 'red', fontSize: '0.8em' }}>Maximum quantity reached.</p>
      )}
    </div>
  );
};

export default ShoppingCart;

import React, { useState, useCallback, useEffect, useRef } from 'react';

interface ShoppingCartProps {
  initialQuantity?: number;
  productId: string; // Unique identifier for the product
  productName: string; // Name of the product
  price: number; // Price of the product
  maxQuantity?: number; // Maximum allowable quantity.  Optional.
  onQuantityChange?: (productId: string, newQuantity: number) => void; // Callback for quantity changes
  currency?: string; // Currency symbol, defaults to USD
  minQuantity?: number; // Minimum allowable quantity. Optional, defaults to 0.
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  initialQuantity = 0,
  productId,
  productName,
  price,
  maxQuantity,
  onQuantityChange,
  currency = '$',
  minQuantity = 0,
}) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [inputValue, setInputValue] = useState<string>(String(initialQuantity));
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset quantity and input value when initialQuantity changes
    setQuantity(initialQuantity);
    setInputValue(String(initialQuantity));
    setError(null); // Clear any previous errors
  }, [initialQuantity]);

  const validateQuantity = (value: number): number => {
    let newValue = value;

    if (isNaN(newValue)) {
      setError('Invalid quantity');
      return quantity; // Revert to the last valid quantity
    }

    if (newValue < minQuantity) {
      newValue = minQuantity;
      setError(`Minimum quantity is ${minQuantity}`);
    } else if (maxQuantity !== undefined && newValue > maxQuantity) {
      newValue = maxQuantity;
      setError(`Maximum quantity is ${maxQuantity}`);
    } else {
      setError(null); // Clear any previous errors
    }

    return newValue;
  };

  const increment = useCallback(() => {
    setQuantity((prevQuantity) => {
      const newQuantity = maxQuantity !== undefined ? Math.min(prevQuantity + 1, maxQuantity) : prevQuantity + 1;
      if (newQuantity !== prevQuantity) {
        const validatedQuantity = validateQuantity(newQuantity);
        if (validatedQuantity !== newQuantity) {
          return prevQuantity; // Revert if validation fails
        }
        onQuantityChange?.(productId, newQuantity);
        setInputValue(String(newQuantity));
        return newQuantity;
      }
      return prevQuantity;
    });
  }, [productId, onQuantityChange, maxQuantity, validateQuantity]);

  const decrement = useCallback(() => {
    setQuantity((prevQuantity) => {
      const newQuantity = Math.max(minQuantity, prevQuantity - 1);
      if (newQuantity !== prevQuantity) {
        const validatedQuantity = validateQuantity(newQuantity);
        if (validatedQuantity !== newQuantity) {
          return prevQuantity; // Revert if validation fails
        }
        onQuantityChange?.(productId, newQuantity);
        setInputValue(String(newQuantity));
        return newQuantity;
      }
      return prevQuantity;
    });
  }, [productId, onQuantityChange, minQuantity, validateQuantity]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    const newValue = parseInt(value, 10);

    const validatedQuantity = validateQuantity(newValue);

    if (!isNaN(newValue) && validatedQuantity === newValue) {
      setQuantity(newValue);
      onQuantityChange?.(productId, newValue);
    }
  }, [productId, onQuantityChange, maxQuantity, minQuantity, validateQuantity]);

  const handleBlur = useCallback(() => {
    const parsedValue = parseInt(inputValue, 10);
    const validatedQuantity = validateQuantity(parsedValue);

    setQuantity(validatedQuantity);
    setInputValue(String(validatedQuantity));
  }, [inputValue, validateQuantity]);

  const subtotal = price * quantity;

  const incrementButtonDisabled = maxQuantity !== undefined && quantity >= maxQuantity;
  const decrementButtonDisabled = quantity <= minQuantity;

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
      <p>Product: {productName}</p>
      <p>Price: {currency}{price.toFixed(2)}</p>
      <div>
        <button
          onClick={decrement}
          aria-label={`Decrement quantity of ${productName}`}
          disabled={decrementButtonDisabled}
        >
          -
        </button>
        <input
          ref={inputRef}
          type="number"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          min={String(minQuantity)}
          max={maxQuantity !== undefined ? String(maxQuantity) : undefined}
          style={{ width: '50px', textAlign: 'center' }}
          aria-label={`Quantity of ${productName}`}
          inputMode="numeric" //  For mobile keyboards
        />
        <button
          onClick={increment}
          aria-label={`Increment quantity of ${productName}`}
          disabled={incrementButtonDisabled}
        >
          +
        </button>
      </div>
      <p>Subtotal: {currency}{subtotal.toFixed(2)}</p>
      {error && <p style={{ color: 'red', fontSize: '0.8em' }}>{error}</p>}
      {maxQuantity !== undefined && quantity >= maxQuantity && !error && (
        <p style={{ color: 'red', fontSize: '0.8em' }}>Maximum quantity reached.</p>
      )}
    </div>
  );
};

export default ShoppingCart;