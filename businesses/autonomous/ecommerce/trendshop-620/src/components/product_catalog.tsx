// src/components/ProductCatalog.tsx
import React, { useState, useEffect } from 'react';
import { Product } from '../types/Product'; // Assuming a Product type exists
import { fetchProducts } from '../api/productService'; // Assuming an API service exists

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
        setLoading(false);
      } catch (err: any) { // Explicitly type 'err' as 'any' to avoid TypeScript errors
        setError(`Failed to load products: ${err.message}`);
        setLoading(false);
      }
    };

    loadProducts();
  }, [category]);

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="product-catalog">
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
  );
};

export default ProductCatalog;