import React, { Key, ReactNode } from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons'; // Import necessary icon for visual representation

interface ShoppingCartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Props {
  items: ShoppingCartItem[];
  onRemoveItem: (itemId: number) => void; // Function to handle removing an item from the cart
}

const MyComponent: React.FC<Props> = ({ items, onRemoveItem }) => {
  const renderItem = (item: ShoppingCartItem, index: number): ReactNode => {
    if (!item) return null; // Handle null or undefined items

    return (
      <div key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
        <ShoppingCartOutlined style={{ marginRight: 10 }} />
        <div>
          {item.name} ({item.quantity}) - ${item.price}
          <button onClick={() => onRemoveItem(item.id)}>Remove</button>
        </div>
      </div>
    );
  };

  return (
    <div aria-label="Shopping Cart">
      {items.map(renderItem)}
    </div>
  );
};

export default MyComponent;

import React, { Key, ReactNode } from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons'; // Import necessary icon for visual representation

interface ShoppingCartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Props {
  items: ShoppingCartItem[];
  onRemoveItem: (itemId: number) => void; // Function to handle removing an item from the cart
}

const MyComponent: React.FC<Props> = ({ items, onRemoveItem }) => {
  const renderItem = (item: ShoppingCartItem, index: number): ReactNode => {
    if (!item) return null; // Handle null or undefined items

    return (
      <div key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
        <ShoppingCartOutlined style={{ marginRight: 10 }} />
        <div>
          {item.name} ({item.quantity}) - ${item.price}
          <button onClick={() => onRemoveItem(item.id)}>Remove</button>
        </div>
      </div>
    );
  };

  return (
    <div aria-label="Shopping Cart">
      {items.map(renderItem)}
    </div>
  );
};

export default MyComponent;