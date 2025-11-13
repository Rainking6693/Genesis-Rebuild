// src/components/ProductCatalog.tsx
import React, { useState, useEffect } from 'react';
import { Product } from '../types/Product'; // Assuming a Product type is defined
import { fetchProducts } from '../api/productService'; // Assuming an API service for fetching products
import ErrorBoundary from './ErrorBoundary'; // Error Boundary component

interface ProductCatalogProps {
  // Add any props needed for the catalog, e.g., category ID
  categoryId?: string;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ categoryId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name'); // Default sorting by name

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedProducts = await fetchProducts(categoryId, searchTerm, sortBy);
        setProducts(fetchedProducts);
      } catch (e: any) {
        console.error("Error fetching products:", e);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryId, searchTerm, sortBy]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ErrorBoundary>
      <div>
        <h2>Product Catalog</h2>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select value={sortBy} onChange={handleSortChange}>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
        <div className="product-list">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-item">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>${product.price}</p>
              <img src={product.imageUrl} alt={product.name} />
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProductCatalog;

// src/components/ProductCatalog.tsx
import React, { useState, useEffect } from 'react';
import { Product } from '../types/Product'; // Assuming a Product type is defined
import { fetchProducts } from '../api/productService'; // Assuming an API service for fetching products
import ErrorBoundary from './ErrorBoundary'; // Error Boundary component

interface ProductCatalogProps {
  // Add any props needed for the catalog, e.g., category ID
  categoryId?: string;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ categoryId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name'); // Default sorting by name

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedProducts = await fetchProducts(categoryId, searchTerm, sortBy);
        setProducts(fetchedProducts);
      } catch (e: any) {
        console.error("Error fetching products:", e);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryId, searchTerm, sortBy]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ErrorBoundary>
      <div>
        <h2>Product Catalog</h2>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select value={sortBy} onChange={handleSortChange}>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
        <div className="product-list">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-item">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>${product.price}</p>
              <img src={product.imageUrl} alt={product.name} />
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProductCatalog;