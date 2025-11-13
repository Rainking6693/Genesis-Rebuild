import React, { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Props {
  products: Product[];
}

const ShoppingCart: React.FC<Props> = ({ products }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    setCartItems(products);
  }, [products]);

  const increaseQuantity = (productId: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      <ul>
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            product={item}
            onIncreaseQuantity={increaseQuantity}
            onDecreaseQuantity={decreaseQuantity}
            onRemoveFromCart={removeFromCart}
          />
        ))}
      </ul>
      <CartSummary totalPrice={getTotalPrice()} />
    </div>
  );
};

interface CartItemProps {
  product: Product;
  onIncreaseQuantity: (productId: number) => void;
  onDecreaseQuantity: (productId: number) => void;
  onRemoveFromCart: (productId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ product, onIncreaseQuantity, onDecreaseQuantity, onRemoveFromCart }) => {
  return (
    <li>
      <div>{product.name}</div>
      <div>${product.price}</div>
      <div>
        Quantity:
        <button onClick={() => onDecreaseQuantity(product.id)}>-</button>
        {product.quantity}
        <button onClick={() => onIncreaseQuantity(product.id)}>+</button>
      </div>
      <button onClick={() => onRemoveFromCart(product.id)}>Remove</button>
    </li>
  );
};

interface CartSummaryProps {
  totalPrice: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ totalPrice }) => {
  return (
    <div>
      <h2>Total:</h2>
      <div>${totalPrice.toFixed(2)}</div>
      <button>Checkout</button>
    </div>
  );
};

export default ShoppingCart;

This updated code includes a shopping cart component that manages a list of products, handles adding, removing, and adjusting quantities, and calculates the total price. It also includes separate components for the cart item and cart summary to improve maintainability.

The code also includes accessibility improvements such as using semantic HTML elements (`<ul>`, `<li>`, `<button>`) and providing a `key` prop for the list items. Additionally, the code uses TypeScript to ensure type safety and improve maintainability.