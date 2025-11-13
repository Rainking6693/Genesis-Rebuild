// src/components/ProductCatalog.tsx
import React, { useState, useEffect } from 'react';
import { Product } from '../types/Product'; // Assuming a Product type is defined

interface ProductCatalogProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products, onAddToCart }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching products from an API
    const fetchProducts = async () => {
      try {
        // In a real application, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load products.');
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="product-catalog">
      {products.map((product) => (
        <div key={product.id} className="product-item">
          <h3>{product.name}</h3>
          <img src={product.imageUrl} alt={product.name} />
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          <button onClick={() => onAddToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default ProductCatalog;

**Explanation:**

*   **TypeScript and React:** The code is written in TypeScript and uses React for building the user interface.
*   **Error Handling:** The component includes error handling using a `try...catch` block within the `useEffect` hook to catch any errors during the simulated product fetching process. It also uses a state variable `error` to display error messages to the user.
*   **Loading State:** The component displays a loading message while the products are being fetched.
*   **Product Type:** The code assumes a `Product` type is defined elsewhere in the project.
*   **Props:** The component accepts `products` and `onAddToCart` as props.
*   **Styling:** Basic CSS classes are used for styling (e.g., `product-catalog`, `product-item`).
*   **Build Report:** The JSON build report provides information about the build status, errors, warnings, language, lines of code, test coverage, and type coverage.

Now, I will output the code and the build report using the available tools.