// src/components/ProductCatalog.tsx
import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Data Validation (Example - adapt to your product schema)
        if (!Array.isArray(data)) {
          throw new Error("Invalid product data format: Expected an array.");
        }

        // Example validation for each product (expand as needed)
        data.forEach((product: any) => {
          if (typeof product.id !== 'string' || product.id.length === 0) {
            throw new Error("Invalid product ID.");
          }
          if (typeof product.name !== 'string' || product.name.length === 0) {
            throw new Error("Invalid product name.");
          }
          if (typeof product.price !== 'number' || product.price <= 0) {
            throw new Error("Invalid product price.");
          }
        });

        setProducts(data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
          <p>Price: ${product.price}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductCatalog;

// src/components/ProductCatalog.tsx
import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products'); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Data Validation (Example - adapt to your product schema)
        if (!Array.isArray(data)) {
          throw new Error("Invalid product data format: Expected an array.");
        }

        // Example validation for each product (expand as needed)
        data.forEach((product: any) => {
          if (typeof product.id !== 'string' || product.id.length === 0) {
            throw new Error("Invalid product ID.");
          }
          if (typeof product.name !== 'string' || product.name.length === 0) {
            throw new Error("Invalid product name.");
          }
          if (typeof product.price !== 'number' || product.price <= 0) {
            throw new Error("Invalid product price.");
          }
        });

        setProducts(data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
          <p>Price: ${product.price}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductCatalog;