// src/components/ProductCatalog.tsx
import React, { useState, useEffect } from 'react';
import { Product } from '../types/Product'; // Assuming a Product type definition
import { fetchProducts } from '../api/productService'; // Assuming an API service

interface ProductCatalogProps {
  // Add any props if needed
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
      <div style={{ color: 'red' }}>
        Error: {error}
        {/* Error Boundary Fallback UI */}
      </div>
    );
  }

  return (
    <div className="product-catalog">
      <h2>Product Catalog</h2>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <button>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductCatalog;

// src/components/ProductCatalog.tsx
import React, { useState, useEffect } from 'react';
import { Product } from '../types/Product'; // Assuming a Product type definition
import { fetchProducts } from '../api/productService'; // Assuming an API service

interface ProductCatalogProps {
  // Add any props if needed
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
      <div style={{ color: 'red' }}>
        Error: {error}
        {/* Error Boundary Fallback UI */}
      </div>
    );
  }

  return (
    <div className="product-catalog">
      <h2>Product Catalog</h2>
      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <button>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductCatalog;

Now, let's generate the build report:

**Final Output:**