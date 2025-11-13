import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Props {
  initialProducts?: Product[];
}

const ShoppingCart: React.FC<Props> = ({ initialProducts }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    setProducts(storedProducts);
  }, []);

  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Product) => {
    const existingProductIndex = products.findIndex((p) => p.id === product.id);

    if (existingProductIndex !== -1) {
      const updatedProduct = { ...products[existingProductIndex], quantity: products[existingProductIndex].quantity + 1 };
      const updatedProducts = [...products];
      updatedProducts[existingProductIndex] = updatedProduct;
      setProducts(updatedProducts);
    } else {
      setProducts([...products, product]);
    }
  };

  const removeProduct = (productId: string) => {
    const updatedProducts = products.filter((product) => product.id !== productId);
    setProducts(updatedProducts);
  };

  const totalPrice = products.reduce((total, product) => total + product.price * product.quantity, 0);

  return (
    <div>
      <h2>Shopping Cart</h2>
      {products.length > 0 ? (
        <>
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                {product.name} - ${product.price} x {product.quantity} - ${product.price * product.quantity}
                <button onClick={() => removeProduct(product.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <p>Total: ${totalPrice}</p>
        </>
      ) : (
        <p>Your shopping cart is empty.</p>
      )}
    </div>
  );
};

export default ShoppingCart;

This updated component now stores the shopping cart in local storage, allowing the cart to persist between sessions. It also includes functions for adding and removing products from the cart, and calculates the total price of the items in the cart. The component is also more accessible by providing a clear message when the cart is empty. Additionally, the component is more maintainable by separating concerns and using TypeScript for type safety.