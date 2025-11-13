// src/components/ProductCatalog.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Assuming React Router is used
import { Product } from '../types/product'; // Assuming a product type definition

interface ProductCatalogProps {
  products: Product[]; // Define the expected product type
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching products (replace with actual API call)
    const fetchProducts = async () => {
      try {
        // Simulate an API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Simulate a potential error
        // if (Math.random() < 0.2) {
        //   throw new Error("Failed to fetch products");
        // }

        setFilteredProducts(products); // Use the passed in products
        setIsLoading(false);
      } catch (err: any) { // Explicitly type err as any to avoid TypeScript errors
        setError(err.message || "An error occurred");
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [products]); // Depend on products so it updates when products change

  useEffect(() => {
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`}>
              <img src={product.imageUrl} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;

// src/components/ProductCatalog.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Assuming React Router is used
import { Product } from '../types/product'; // Assuming a product type definition

interface ProductCatalogProps {
  products: Product[]; // Define the expected product type
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching products (replace with actual API call)
    const fetchProducts = async () => {
      try {
        // Simulate an API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Simulate a potential error
        // if (Math.random() < 0.2) {
        //   throw new Error("Failed to fetch products");
        // }

        setFilteredProducts(products); // Use the passed in products
        setIsLoading(false);
      } catch (err: any) { // Explicitly type err as any to avoid TypeScript errors
        setError(err.message || "An error occurred");
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [products]); // Depend on products so it updates when products change

  useEffect(() => {
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`}>
              <img src={product.imageUrl} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;