import React, { FC, useState, Dispatch, SetStateAction } from 'react';
import PropTypes from 'prop-types';
import { sanitize } from 'dompurify';

interface Props {
  message: string;
}

interface CartItem {
  id: string;
  name: string;
  quantity: number;
}

const MyShoppingCart: FC<Props> = ({ message }) => {
  const [cartItems, setCartItems] : [CartItem[], Dispatch<SetStateAction<CartItem[]>>] = useState<CartItem[]>([]);

  const addItemToCart = (item: CartItem) => {
    const existingItemIndex = cartItems.findIndex((i) => i.id === item.id);

    if (existingItemIndex !== -1) {
      setCartItems(
        cartItems.map((i, index) =>
          index === existingItemIndex ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCartItems([...cartItems, item]);
    }
  };

  const sanitizeMessage = (message: string) => {
    return sanitize(message);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const itemName = form.elements.itemName.value;
    const itemQuantity = Number(form.elements.itemQuantity.value);

    if (!itemName || !itemQuantity) return;

    addItemToCart({ id: new Date().toISOString(), name: itemName, quantity: itemQuantity });
    form.reset();
  };

  return (
    <div className="shopping-cart-container" role="application">
      <h1>{sanitizeMessage(message)}</h1>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.name} ({item.quantity})
          </li>
        ))}
      </ul>
      {/* Add a form to add items to the cart */}
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="item-name">Item Name:</label>
        <input id="item-name" type="text" required />
        <label htmlFor="item-quantity">Quantity:</label>
        <input id="item-quantity" type="number" defaultValue={1} required />
        <button type="submit">Add to Cart</button>
      </form>
    </div>
  );
};

MyShoppingCart.displayName = 'MyShoppingCart';

MyShoppingCart.defaultProps = {
  key: 'unique-shopping-cart-id',
};

MyShoppingCart.propTypes = {
  message: PropTypes.string.isRequired,
};

export default MyShoppingCart;

In this version, I've added an event handler for the form submission to prevent the default form submission behavior and reset the form after adding an item to the cart. I've also added the `required` attribute to the input fields to ensure that they are filled out before submitting the form. Additionally, I've used the `findIndex` method instead of `find` to get the index of an existing item in the cart for better performance.