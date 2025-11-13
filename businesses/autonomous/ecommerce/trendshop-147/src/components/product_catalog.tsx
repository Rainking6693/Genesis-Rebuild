// src/components/ProductCatalog.tsx
import React, { useState, useEffect } from 'react';
import { Product } from '../types/product'; // Assuming a product type definition
import { fetchProducts } from '../api/products'; // Assuming an API endpoint for products

interface ProductCatalogProps {
  // Add any props the component might need
}

const ProductCatalog: React.FC<ProductCatalogProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name'); // Default sorting by name

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err: any) {
        setError(`Failed to load products: ${err.message}`);
        console.error(err); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filtering logic
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'price') {
      return a.price - b.price;
    }
    return 0;
  });

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

  return (
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
      <ul>
        {sortedProducts.map(product => (
          <li key={product.id}>
            <a href={`/product/${product.id}`}>{product.name} - ${product.price}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductCatalog;

// src/components/ProductCatalog.tsx
import React, { useState, useEffect } from 'react';
import { Product } from '../types/product'; // Assuming a product type definition
import { fetchProducts } from '../api/products'; // Assuming an API endpoint for products

interface ProductCatalogProps {
  // Add any props the component might need
}

const ProductCatalog: React.FC<ProductCatalogProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name'); // Default sorting by name

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err: any) {
        setError(`Failed to load products: ${err.message}`);
        console.error(err); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filtering logic
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'price') {
      return a.price - b.price;
    }
    return 0;
  });

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

  return (
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
      <ul>
        {sortedProducts.map(product => (
          <li key={product.id}>
            <a href={`/product/${product.id}`}>{product.name} - ${product.price}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductCatalog;