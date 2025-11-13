// src/components/ProductCatalog.tsx
import React, { useState, useEffect } from 'react';
import { Product } from '../types/Product'; // Assuming a Product type exists
import { fetchProducts } from '../api/productService'; // Assuming a product service API
import ErrorBoundary from './ErrorBoundary'; // Assuming an ErrorBoundary component exists

interface ProductCatalogProps {
  // Add any necessary props here
}

const ProductCatalog: React.FC<ProductCatalogProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load products.');
        setLoading(false);
        console.error("Error fetching products:", err); // Log the error for debugging
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div>Error: {error}</div>
      </ErrorBoundary>
    );
  }

  return (
    <div>
      <h1>Product Catalog</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;