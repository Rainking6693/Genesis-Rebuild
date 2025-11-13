import React, { FC, ReactNode } from 'react';

interface ShoppingCartProps {
  items: Array<{ id: string; name: string; quantity: number }>;
  onRemoveItem: (itemId: string) => void;
  totalItems: number;
  totalPrice: number;
  isEmpty: boolean;
  error?: string;
}

interface EmptyCartProps {
  onShowCheckout: () => void;
}

const EmptyCart: FC<EmptyCartProps> = ({ onShowCheckout }) => {
  return (
    <div className="empty-cart">
      <h2>Your cart is empty</h2>
      <button onClick={onShowCheckout}>Start Shopping</button>
    </div>
  );
};

const Item: FC<{ item: { id: string; name: string; quantity: number }; onRemove: (itemId: string) => void }> = ({ item, onRemove }) => {
  return (
    <div className="item">
      <h3>{item.name}</h3>
      <div className="quantity">
        Quantity: {item.quantity}
        <button onClick={() => onRemove(item.id)}>Remove</button>
      </div>
    </div>
  );
};

const ShoppingCart: FC<ShoppingCartProps> = ({ items, onRemoveItem, totalItems, totalPrice, isEmpty, error }) => {
  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        {!isEmpty && (
          <button onClick={() => window.location.reload()}>Retry</button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return <EmptyCart onShowCheckout={() => alert('Checkout functionality not implemented yet')} />;
  }

  return (
    <div className="shopping-cart">
      <h2>Your Cart</h2>
      <div className="items">
        {items.map((item) => (
          <Item key={item.id} item={item} onRemove={onRemoveItem} />
        ))}
      </div>
      <div className="total">
        <h3>Total Items: {totalItems}</h3>
        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
        <button>Checkout</button>
      </div>
    </div>
  );
};

export default ShoppingCart;

import React, { FC, ReactNode } from 'react';

interface ShoppingCartProps {
  items: Array<{ id: string; name: string; quantity: number }>;
  onRemoveItem: (itemId: string) => void;
  totalItems: number;
  totalPrice: number;
  isEmpty: boolean;
  error?: string;
}

interface EmptyCartProps {
  onShowCheckout: () => void;
}

const EmptyCart: FC<EmptyCartProps> = ({ onShowCheckout }) => {
  return (
    <div className="empty-cart">
      <h2>Your cart is empty</h2>
      <button onClick={onShowCheckout}>Start Shopping</button>
    </div>
  );
};

const Item: FC<{ item: { id: string; name: string; quantity: number }; onRemove: (itemId: string) => void }> = ({ item, onRemove }) => {
  return (
    <div className="item">
      <h3>{item.name}</h3>
      <div className="quantity">
        Quantity: {item.quantity}
        <button onClick={() => onRemove(item.id)}>Remove</button>
      </div>
    </div>
  );
};

const ShoppingCart: FC<ShoppingCartProps> = ({ items, onRemoveItem, totalItems, totalPrice, isEmpty, error }) => {
  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        {!isEmpty && (
          <button onClick={() => window.location.reload()}>Retry</button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return <EmptyCart onShowCheckout={() => alert('Checkout functionality not implemented yet')} />;
  }

  return (
    <div className="shopping-cart">
      <h2>Your Cart</h2>
      <div className="items">
        {items.map((item) => (
          <Item key={item.id} item={item} onRemove={onRemoveItem} />
        ))}
      </div>
      <div className="total">
        <h3>Total Items: {totalItems}</h3>
        <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
        <button>Checkout</button>
      </div>
    </div>
  );
};

export default ShoppingCart;