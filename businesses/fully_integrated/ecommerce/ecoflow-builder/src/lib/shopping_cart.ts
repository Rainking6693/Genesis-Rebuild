import React, { createContext, useState, useContext, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity?: number; // Add optional quantity property for products in cart
  stock?: number; // Add optional stock property to handle out-of-stock items
}

interface ShoppingCartContextData {
  cartItems: Product[];
  totalPrice: number;
  addToCart: (product: Product) => void;
}

const ShoppingCartContext = createContext<ShoppingCartContextData>({} as ShoppingCartContextData);

export const useShoppingCart = () => useContext(ShoppingCartContext);

export function ShoppingCartProvider({ children }: any) {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const addToCart = (product: Product) => {
    if (product.stock && product.stock <= 0) return; // Handle out-of-stock items

    const existingItemIndex = cartItems.findIndex((item) => item.id === product.id);

    if (existingItemIndex >= 0) {
      const updatedCartItems = [...cartItems];
      if (updatedCartItems[existingItemIndex].quantity !== undefined) {
        updatedCartItems[existingItemIndex].quantity = (updatedCartItems[existingItemIndex].quantity || 0) + 1;
      } else {
        updatedCartItems[existingItemIndex].quantity = 1;
      }
      setCartItems(updatedCartItems);
    } else {
      product.quantity = 1;
      setCartItems([...cartItems, product]);
    }

    setTotalPrice(cartItems.reduce((accumulator: number, currentItem: Product) => accumulator + currentItem.price * (currentItem.quantity || 1), 0));
  };

  useEffect(() => {
    let updatedTotalPrice = 0;
    for (const item of cartItems) {
      if (item.stock && item.stock <= 0) continue; // Handle out-of-stock items
      updatedTotalPrice += item.price * (item.quantity || 1);
    }
    setTotalPrice(updatedTotalPrice);
  }, [cartItems]);

  return (
    <ShoppingCartContext.Provider value={{ cartItems, totalPrice, addToCart }}>
      {children}
    </ShoppingCartContext.Provider>
  );
}

const MyComponent: React.FC<Props> = ({ id }) => {
  const { cartItems, totalPrice } = useContext(ShoppingCartContext);

  // Handle adding items to the cart
  const handleAddToCart = (product: Product) => {
    if (product.quantity && product.quantity <= 0) return; // Handle items with zero or negative quantity
    if (product.stock && product.stock <= 0) return; // Handle out-of-stock items

    product.quantity--; // Decrease product's quantity in inventory when adding to cart
    addToCart(product);
  };

  return (
    <div id={id} role="shopping-cart">
      {/* Display cart items */}
      <ul role="list">
        {cartItems.map((item) => (
          <li key={item.id} role="listitem">
            {item.name} - ${item.price} {item.quantity && `(${item.quantity})`}
          </li>
        ))}
      </ul>

      {/* Display total price */}
      <p>Total: ${totalPrice}</p>

      {/* Add checkout button */}
      <button onClick={() => console.log('Checkout')}>Checkout</button>

      {/* Render products for shopping */}
      <ProductList products={products} onAddToCart={handleAddToCart} />
    </div>
  );
};

// Define ProductList component
const ProductList: React.FC<{ products: Product[]; onAddToCart: (product: Product) => void }> = ({ products, onAddToCart }) => {
  return (
    <ul role="list">
      {products.map((product) => (
        <li key={product.id} role="listitem">
          <img src={product.imageUrl} alt={product.name} />
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          {product.stock && product.stock <= 0 ? (
            <p style={{ color: 'red' }}>Out of stock</p>
          ) : (
            <button onClick={() => onAddToCart(product)}>Add to Cart</button>
          )}
        </li>
      ))}
    </ul>
  );
};

export { MyComponent, ProductList };

Changes made:

1. Added a `stock` property to the `Product` interface to handle out-of-stock items.
2. Updated the `ShoppingCartProvider` and `MyComponent` to use the new `Product` interface and handle out-of-stock items.
3. Added a check to handle items with zero or negative quantity.
4. Added ARIA roles to improve accessibility.
5. Updated the `ProductList` component to use the new `Product` interface, handle out-of-stock items, and added ARIA roles.
6. Moved the total price calculation to a `useEffect` hook to ensure it's always up-to-date.