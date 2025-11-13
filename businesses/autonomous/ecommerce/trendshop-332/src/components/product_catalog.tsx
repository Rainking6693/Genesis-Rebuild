// src/components/ProductCatalog.tsx
import React, { useState, useEffect } from 'react';
import { Product } from '../types/Product'; // Assuming a Product type definition

interface ProductCatalogProps {
  products: Product[];
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products }) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading data (replace with actual API call)
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulate potential error
        // if (Math.random() < 0.2) {
        //   throw new Error("Failed to fetch products");
        // }

        setFilteredProducts(products); // Initially display all products
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching products.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [products]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleError = () => {
    setError(null);
    setIsLoading(true);
    // Retry fetching data or take other appropriate action
  }

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return (
      <div>
        Error: {error}
        <button onClick={handleError}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearch}
      />
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
  );
};

export default ProductCatalog;

// Example Product type definition (create src/types/Product.ts)
// export interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   imageUrl: string;
// }

/*
  Suggested Unit Tests:

  1.  Test that the component renders without errors.
  2.  Test that the loading state is displayed correctly.
  3.  Test that the error state is displayed correctly.
  4.  Test that the search functionality filters products correctly.
  5.  Test that the component displays the correct number of products.
  6.  Test that the retry button works correctly after an error.
*/