import React, { FC, useEffect, useState } from 'react';

interface Props {
  id: string;
  productName: string;
  productPrice: number;
  quantity: number;
  onRemove: (id: string) => void;
}

const ShoppingCartItem: FC<Props> = ({ id, productName, productPrice, quantity, onRemove }) => {
  const [totalPrice, setTotalPrice] = useState(productPrice * quantity);

  useEffect(() => {
    setTotalPrice(productPrice * quantity);
  }, [productPrice, quantity]);

  return (
    <div className="shopping-cart-item">
      <h3>{productName}</h3>
      <p>Quantity: {quantity}</p>
      <p>Price: ${totalPrice.toFixed(2)}</p>
      <button onClick={() => onRemove(id)}>Remove</button>
    </div>
  );
};

interface ShoppingCartProps {
  items: Props[];
  onRemoveItem: (id: string) => void;
}

const ShoppingCart: FC<ShoppingCartProps> = ({ items, onRemoveItem }) => {
  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        items.map((item) => (
          <ShoppingCartItem key={item.id} {...item} onRemove={onRemoveItem} />
        ))
      )}
    </div>
  );
};

export default ShoppingCart;

import React, { FC, useEffect, useState } from 'react';

interface Props {
  id: string;
  productName: string;
  productPrice: number;
  quantity: number;
  onRemove: (id: string) => void;
}

const ShoppingCartItem: FC<Props> = ({ id, productName, productPrice, quantity, onRemove }) => {
  const [totalPrice, setTotalPrice] = useState(productPrice * quantity);

  useEffect(() => {
    setTotalPrice(productPrice * quantity);
  }, [productPrice, quantity]);

  return (
    <div className="shopping-cart-item">
      <h3>{productName}</h3>
      <p>Quantity: {quantity}</p>
      <p>Price: ${totalPrice.toFixed(2)}</p>
      <button onClick={() => onRemove(id)}>Remove</button>
    </div>
  );
};

interface ShoppingCartProps {
  items: Props[];
  onRemoveItem: (id: string) => void;
}

const ShoppingCart: FC<ShoppingCartProps> = ({ items, onRemoveItem }) => {
  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        items.map((item) => (
          <ShoppingCartItem key={item.id} {...item} onRemove={onRemoveItem} />
        ))
      )}
    </div>
  );
};

export default ShoppingCart;