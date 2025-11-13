import React, { FC } from 'react';

interface Props {
  message: string;
}

const MyShoppingCart: FC<Props> = ({ message }) => {
  return <div className="shopping-cart-message">{message}</div>;
};

MyShoppingCart.displayName = 'MyShoppingCart';

// Add error handling and validation for props
type ValidProps = Omit<Props, 'message'> & {
  message: string;
};

MyShoppingCart.propTypes = {
  message: PropTypes.string.isRequired,
};

MyShoppingCart.defaultProps = {
  message: 'No items in the shopping cart',
};

export default MyShoppingCart;

import React, { FC } from 'react';

interface Props {
  message: string;
}

const MyShoppingCart: FC<Props> = ({ message }) => {
  return <div className="shopping-cart-message">{message}</div>;
};

MyShoppingCart.displayName = 'MyShoppingCart';

// Add error handling and validation for props
type ValidProps = Omit<Props, 'message'> & {
  message: string;
};

MyShoppingCart.propTypes = {
  message: PropTypes.string.isRequired,
};

MyShoppingCart.defaultProps = {
  message: 'No items in the shopping cart',
};

export default MyShoppingCart;