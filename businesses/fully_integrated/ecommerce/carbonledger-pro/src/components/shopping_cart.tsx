import React, { FC, useContext, useEffect, useState } from 'react';
import { ShoppingCartContext, CartItem } from './ShoppingCartContext';
import classnames from 'classnames';
import styles from './ShoppingCart.module.css';

interface Props {
  item: CartItem;
}

const MyShoppingCartItem: FC<Props> = ({ item }) => {
  const [error, setError] = useState(false);

  const { cartItems, removeFromCart } = useContext(ShoppingCartContext);

  useEffect(() => {
    if (!cartItems.includes(item)) {
      setError(true);
    } else {
      setError(false);
    }
  }, [cartItems, item]);

  const handleRemoveClick = () => {
    removeFromCart(item.id);
  };

  const cartItemClassName = classnames(styles.shoppingCartItem, {
    [styles.shoppingCartItemError]: error,
  });

  return (
    <div className={cartItemClassName}>
      <div className={styles.shoppingCartItemDetails} role="group" aria-labelledby={`item-name-${item.id}`}>
        <div id={`item-name-${item.id}`} className={styles.shoppingCartItemName}>
          {item.name}
        </div>
        <div className={styles.shoppingCartItemQuantity}>Quantity: {item.quantity}</div>
        <div className={styles.shoppingCartItemPrice}>Price: ${item.price}</div>
      </div>
      <button className={styles.shoppingCartRemoveButton} onClick={handleRemoveClick}>
        Remove
      </button>
    </div>
  );
};

MyShoppingCartItem.displayName = 'MyShoppingCartItem';

interface Props {
  id: string;
}

const MyShoppingCart: FC<Props> = ({ id }) => {
  const cartItem = cartItems.find((item) => item.id === id);

  if (!cartItem) {
    return (
      <div className={classnames(styles.shoppingCartMessage, styles.error)} role="alert">
        Error: Item not found in the cart
      </div>
    );
  }

  return <MyShoppingCartItem item={cartItem} key={id} />;
};

MyShoppingCart.displayName = 'MyShoppingCart';

export default MyShoppingCart;

In this updated version, I've created a reusable shopping cart item component `MyShoppingCartItem`. I've added an error state to handle cases when the item is not found in the cart. I've also added ARIA attributes for accessibility, such as `role="group"` and `aria-labelledby`. Lastly, I've used the `useEffect` hook to manage the error state based on the cart items.