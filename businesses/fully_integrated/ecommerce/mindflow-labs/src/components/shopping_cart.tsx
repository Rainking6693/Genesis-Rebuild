import React, { useState, useEffect } from 'react';
import { ShoppingCartProps, ShoppingCartItem } from './ShoppingCartProps';

type ValidShoppingCartItem = ShoppingCartItem & {
  id: number;
  quantity: number;
  price: number;
};

const ShoppingCart: React.FC<ShoppingCartProps> = ({ onAddProduct, onRemoveProduct, onUpdateQuantity }) => {
  const [items, setItems] = useState<ValidShoppingCartItem[]>([]);

  useEffect(() => {
    if (Array.isArray(props.products) && props.products.every((item) => item instanceof ShoppingCartItem)) {
      setItems(props.products);
    }
  }, [props.products]);

  const handleAddProduct = (product: ShoppingCartItem) => {
    if (product.quantity > 0 && product.price > 0 && product.id > 0) {
      const existingProductIndex = items.findIndex((item) => item.id === product.id);

      if (existingProductIndex !== -1) {
        const updatedItems = [...items];
        updatedItems[existingProductIndex].quantity += product.quantity;
        setItems(updatedItems);
      } else {
        onAddProduct(product);
      }
    }
  };

  const handleRemoveProduct = (productId: number) => {
    if (productId > 0) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
      onRemoveProduct(productId);
    }
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (productId > 0 && newQuantity >= 0 && typeof newQuantity === 'number') {
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
      );
      onUpdateQuantity(productId, newQuantity);
    }
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalCost = items.reduce((total, item) => total + item.quantity * item.price, 0);

  return (
    <div role="region" aria-label="Shopping Cart">
      <h2>Your Shopping Cart</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} ({item.quantity}) - ${(item.quantity * item.price).toFixed(2)}
            <button onClick={() => handleRemoveProduct(item.id)}>Remove</button>
            <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
            <input type="number" value={item.quantity} readOnly />
            <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
          </li>
        ))}
      </ul>
      <div>
        Total Items: {totalItems}
        <span id="total-cost">Total Cost: ${totalCost.toFixed(2)}</span>
      </div>
    </div>
  );
};

interface ShoppingCartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export default ShoppingCart;

import React, { useState, useEffect } from 'react';
import { ShoppingCartProps, ShoppingCartItem } from './ShoppingCartProps';

type ValidShoppingCartItem = ShoppingCartItem & {
  id: number;
  quantity: number;
  price: number;
};

const ShoppingCart: React.FC<ShoppingCartProps> = ({ onAddProduct, onRemoveProduct, onUpdateQuantity }) => {
  const [items, setItems] = useState<ValidShoppingCartItem[]>([]);

  useEffect(() => {
    if (Array.isArray(props.products) && props.products.every((item) => item instanceof ShoppingCartItem)) {
      setItems(props.products);
    }
  }, [props.products]);

  const handleAddProduct = (product: ShoppingCartItem) => {
    if (product.quantity > 0 && product.price > 0 && product.id > 0) {
      const existingProductIndex = items.findIndex((item) => item.id === product.id);

      if (existingProductIndex !== -1) {
        const updatedItems = [...items];
        updatedItems[existingProductIndex].quantity += product.quantity;
        setItems(updatedItems);
      } else {
        onAddProduct(product);
      }
    }
  };

  const handleRemoveProduct = (productId: number) => {
    if (productId > 0) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
      onRemoveProduct(productId);
    }
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (productId > 0 && newQuantity >= 0 && typeof newQuantity === 'number') {
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
      );
      onUpdateQuantity(productId, newQuantity);
    }
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalCost = items.reduce((total, item) => total + item.quantity * item.price, 0);

  return (
    <div role="region" aria-label="Shopping Cart">
      <h2>Your Shopping Cart</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} ({item.quantity}) - ${(item.quantity * item.price).toFixed(2)}
            <button onClick={() => handleRemoveProduct(item.id)}>Remove</button>
            <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
            <input type="number" value={item.quantity} readOnly />
            <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
          </li>
        ))}
      </ul>
      <div>
        Total Items: {totalItems}
        <span id="total-cost">Total Cost: ${totalCost.toFixed(2)}</span>
      </div>
    </div>
  );
};

interface ShoppingCartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export default ShoppingCart;