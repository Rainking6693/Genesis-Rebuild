// src/components/ProductCatalog.tsx
import React, { useState, useEffect } from 'react';
import { Product } from '../types/Product'; // Assuming a Product type is defined
import { fetchProducts } from '../api/productService'; // Assuming an API service for fetching products
import ErrorBoundary from './ErrorBoundary'; // Assuming an ErrorBoundary component exists

interface ProductCatalogProps {
  // Add any props the component might need
}

const ProductCatalog: React.FC<ProductCatalogProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productData = await fetchProducts();
        setProducts(productData);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
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
      <h2>Product Catalog</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
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