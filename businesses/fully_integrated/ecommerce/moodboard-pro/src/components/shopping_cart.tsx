import React, { useState, useCallback, useEffect } from 'react';

interface ShoppingCartProps {
  initialQuantity?: number;
  price: number;
  itemName: string;
  maxQuantity?: number; // Optional maximum quantity
  minQuantity?: number; // Optional minimum quantity, defaults to 0
  onQuantityChange?: (newQuantity: number) => void;
  currency?: string; // Optional currency symbol, defaults to $
  id?: string; // Optional ID for accessibility
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  initialQuantity = 0,
  price,
  itemName,
  maxQuantity,
  minQuantity = 0,
  onQuantityChange,
  currency = '$',
  id,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Validate initial quantity against min/max
    if (initialQuantity < minQuantity) {
      console.warn(`Initial quantity ${initialQuantity} is less than minQuantity ${minQuantity}. Setting to minQuantity.`);
      setQuantity(minQuantity);
    }
    if (maxQuantity !== undefined && initialQuantity > maxQuantity) {
      console.warn(`Initial quantity ${initialQuantity} is greater than maxQuantity ${maxQuantity}. Setting to maxQuantity.`);
      setQuantity(maxQuantity);
    }
  }, [initialQuantity, minQuantity, maxQuantity]);

  const increment = useCallback(() => {
    setQuantity((prevQuantity) => {
      const newQuantity = Math.min(prevQuantity + 1, maxQuantity || Number.MAX_SAFE_INTEGER);

      if (newQuantity > maxQuantity) {
        setError(`Maximum quantity reached: ${maxQuantity}`);
        return prevQuantity; // Don't update quantity if max is reached
      }

      setError(null); // Clear any previous error
      onQuantityChange?.(newQuantity);
      return newQuantity;
    });
  }, [maxQuantity, onQuantityChange]);

  const decrement = useCallback(() => {
    setQuantity((prevQuantity) => {
      const newQuantity = Math.max(prevQuantity - 1, minQuantity || 0);

      if (newQuantity < minQuantity) {
        setError(`Minimum quantity reached: ${minQuantity}`);
        return prevQuantity; // Don't update quantity if min is reached
      }

      setError(null); // Clear any previous error
      onQuantityChange?.(newQuantity);
      return newQuantity;
    });
  }, [minQuantity, onQuantityChange]);

  const totalPrice = quantity * price;

  const handleQuantityChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;

      // Allow only numbers
      if (!/^\d*$/.test(inputValue)) {
        return; // Reject non-numeric input
      }

      const newQuantity = inputValue === '' ? 0 : parseInt(inputValue, 10);

      if (isNaN(newQuantity)) {
        setError('Invalid quantity');
        return;
      }

      if (newQuantity < minQuantity) {
        setError(`Minimum quantity is ${minQuantity}`);
        return;
      }

      if (maxQuantity !== undefined && newQuantity > maxQuantity) {
        setError(`Maximum quantity is ${maxQuantity}`);
        return;
      }

      setError(null);
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    },
    [minQuantity, maxQuantity, onQuantityChange]
  );

  const inputId = id ? `quantity-${id}` : `quantity-${itemName.replace(/\s+/g, '-')}`; // Generate unique ID

  return (
    <div
      role="group" // Add role for accessibility
      style={{
        border: '1px solid #ccc',
        padding: '10px',
        margin: '10px',
        borderRadius: '5px',
      }}
      aria-label={`Shopping cart for ${itemName}`}
    >
      <h3>{itemName}</h3>
      <p>
        Price: {currency}
        {price.toFixed(2)}
      </p>
      <label htmlFor={inputId}>Quantity:</label>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={decrement}
          disabled={quantity <= minQuantity}
          aria-label="Decrement quantity"
        >
          -
        </button>
        <input
          type="number" // Change type to number for easier input
          id={inputId}
          value={quantity.toString()}
          onChange={handleQuantityChange}
          style={{ width: '40px', textAlign: 'center', margin: '0 5px' }}
          aria-label="Enter quantity"
          aria-invalid={error !== null}
        />
        <button
          onClick={increment}
          disabled={maxQuantity !== undefined && quantity >= maxQuantity}
          aria-label="Increment quantity"
        >
          +
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        Total: {currency}
        {totalPrice.toFixed(2)}
      </p>
    </div>
  );
};

export default ShoppingCart;

import React, { useState, useCallback, useEffect } from 'react';

interface ShoppingCartProps {
  initialQuantity?: number;
  price: number;
  itemName: string;
  maxQuantity?: number; // Optional maximum quantity
  minQuantity?: number; // Optional minimum quantity, defaults to 0
  onQuantityChange?: (newQuantity: number) => void;
  currency?: string; // Optional currency symbol, defaults to $
  id?: string; // Optional ID for accessibility
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  initialQuantity = 0,
  price,
  itemName,
  maxQuantity,
  minQuantity = 0,
  onQuantityChange,
  currency = '$',
  id,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Validate initial quantity against min/max
    if (initialQuantity < minQuantity) {
      console.warn(`Initial quantity ${initialQuantity} is less than minQuantity ${minQuantity}. Setting to minQuantity.`);
      setQuantity(minQuantity);
    }
    if (maxQuantity !== undefined && initialQuantity > maxQuantity) {
      console.warn(`Initial quantity ${initialQuantity} is greater than maxQuantity ${maxQuantity}. Setting to maxQuantity.`);
      setQuantity(maxQuantity);
    }
  }, [initialQuantity, minQuantity, maxQuantity]);

  const increment = useCallback(() => {
    setQuantity((prevQuantity) => {
      const newQuantity = Math.min(prevQuantity + 1, maxQuantity || Number.MAX_SAFE_INTEGER);

      if (newQuantity > maxQuantity) {
        setError(`Maximum quantity reached: ${maxQuantity}`);
        return prevQuantity; // Don't update quantity if max is reached
      }

      setError(null); // Clear any previous error
      onQuantityChange?.(newQuantity);
      return newQuantity;
    });
  }, [maxQuantity, onQuantityChange]);

  const decrement = useCallback(() => {
    setQuantity((prevQuantity) => {
      const newQuantity = Math.max(prevQuantity - 1, minQuantity || 0);

      if (newQuantity < minQuantity) {
        setError(`Minimum quantity reached: ${minQuantity}`);
        return prevQuantity; // Don't update quantity if min is reached
      }

      setError(null); // Clear any previous error
      onQuantityChange?.(newQuantity);
      return newQuantity;
    });
  }, [minQuantity, onQuantityChange]);

  const totalPrice = quantity * price;

  const handleQuantityChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;

      // Allow only numbers
      if (!/^\d*$/.test(inputValue)) {
        return; // Reject non-numeric input
      }

      const newQuantity = inputValue === '' ? 0 : parseInt(inputValue, 10);

      if (isNaN(newQuantity)) {
        setError('Invalid quantity');
        return;
      }

      if (newQuantity < minQuantity) {
        setError(`Minimum quantity is ${minQuantity}`);
        return;
      }

      if (maxQuantity !== undefined && newQuantity > maxQuantity) {
        setError(`Maximum quantity is ${maxQuantity}`);
        return;
      }

      setError(null);
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    },
    [minQuantity, maxQuantity, onQuantityChange]
  );

  const inputId = id ? `quantity-${id}` : `quantity-${itemName.replace(/\s+/g, '-')}`; // Generate unique ID

  return (
    <div
      role="group" // Add role for accessibility
      style={{
        border: '1px solid #ccc',
        padding: '10px',
        margin: '10px',
        borderRadius: '5px',
      }}
      aria-label={`Shopping cart for ${itemName}`}
    >
      <h3>{itemName}</h3>
      <p>
        Price: {currency}
        {price.toFixed(2)}
      </p>
      <label htmlFor={inputId}>Quantity:</label>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={decrement}
          disabled={quantity <= minQuantity}
          aria-label="Decrement quantity"
        >
          -
        </button>
        <input
          type="number" // Change type to number for easier input
          id={inputId}
          value={quantity.toString()}
          onChange={handleQuantityChange}
          style={{ width: '40px', textAlign: 'center', margin: '0 5px' }}
          aria-label="Enter quantity"
          aria-invalid={error !== null}
        />
        <button
          onClick={increment}
          disabled={maxQuantity !== undefined && quantity >= maxQuantity}
          aria-label="Increment quantity"
        >
          +
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        Total: {currency}
        {totalPrice.toFixed(2)}
      </p>
    </div>
  );
};

export default ShoppingCart;