import React, { FC, useContext, useState } from 'react';
import { ShoppingCartContext } from '../contexts/ShoppingCartContext';

interface Props {
  productId: string;
}

interface ShoppingCartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

const ShoppingCart: FC<Props> = (props) => {
  const { addItem, getItemById } = useContext(ShoppingCartContext);
  const [item, setItem] = useState<ShoppingCartItem | null>(null);

  React.useEffect(() => {
    const fetchedItem = getItemById(props.productId);
    if (fetchedItem) {
      setItem(fetchedItem);
    } else {
      setItem({
        id: props.productId,
        name: 'Unknown Product',
        price: 0,
        imageUrl: '',
        quantity: 1,
      });
    }
  }, [props.productId]);

  const handleAddToCart = () => {
    if (!item) return;

    addItem({
      ...item,
      quantity: item.quantity + 1,
    });
  };

  if (!item) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <img src={item.imageUrl} alt={item.name} />
      <h2>{item.name}</h2>
      <p>${item.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <a href={item.imageUrl} target="_blank" rel="noopener noreferrer">
        View Image
      </a>
      {!item.imageUrl && <p>Image URL is missing for this product.</p>}
      {item.name.length === 0 && <p>Product name is missing for this item.</p>}
      {item.price <= 0 && <p>Product price is invalid for this item.</p>}
    </div>
  );
};

export default ShoppingCart;

import React, { FC, useContext, useState } from 'react';
import { ShoppingCartContext } from '../contexts/ShoppingCartContext';

interface Props {
  productId: string;
}

interface ShoppingCartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

const ShoppingCart: FC<Props> = (props) => {
  const { addItem, getItemById } = useContext(ShoppingCartContext);
  const [item, setItem] = useState<ShoppingCartItem | null>(null);

  React.useEffect(() => {
    const fetchedItem = getItemById(props.productId);
    if (fetchedItem) {
      setItem(fetchedItem);
    } else {
      setItem({
        id: props.productId,
        name: 'Unknown Product',
        price: 0,
        imageUrl: '',
        quantity: 1,
      });
    }
  }, [props.productId]);

  const handleAddToCart = () => {
    if (!item) return;

    addItem({
      ...item,
      quantity: item.quantity + 1,
    });
  };

  if (!item) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <img src={item.imageUrl} alt={item.name} />
      <h2>{item.name}</h2>
      <p>${item.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <a href={item.imageUrl} target="_blank" rel="noopener noreferrer">
        View Image
      </a>
      {!item.imageUrl && <p>Image URL is missing for this product.</p>}
      {item.name.length === 0 && <p>Product name is missing for this item.</p>}
      {item.price <= 0 && <p>Product price is invalid for this item.</p>}
    </div>
  );
};

export default ShoppingCart;