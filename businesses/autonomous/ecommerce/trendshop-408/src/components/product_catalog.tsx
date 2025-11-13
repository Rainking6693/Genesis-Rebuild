// src/components/ProductCatalog.tsx
import React, { useState, useEffect } from 'react';
import { Product } from '../types/Product'; // Assuming a Product type is defined
import { fetchProducts } from '../api/productService'; // Assuming an API service exists
import ErrorBoundary from './ErrorBoundary'; // Import ErrorBoundary component

interface ProductCatalogProps {
  category?: string; // Optional category filter
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchProducts(category);
        setProducts(fetchedProducts);
      } catch (err: any) { // Explicitly type 'err' as 'any' to avoid TypeScript errors
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category]);

  if (error) {
    return (
      <div className="error-message">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (products.length === 0) {
    return <div className="no-products">No products found.</div>;
  }

  return (
    <div className="product-catalog">
      {products.map((product) => (
        <ErrorBoundary key={product.id} fallback={<p>Error loading product.</p>}>
          <div className="product-item">
            <h3>{product.name}</h3>
            <img src={product.imageUrl} alt={product.name} />
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <button>Add to Cart</button>
          </div>
        </ErrorBoundary>
      ))}
    </div>
  );
};

export default ProductCatalog;