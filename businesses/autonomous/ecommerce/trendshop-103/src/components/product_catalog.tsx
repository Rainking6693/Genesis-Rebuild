// src/components/ProductCatalog.tsx
import React, { useState, useEffect } from 'react';
import { Product } from '../types/Product'; // Assuming a Product type is defined

interface ProductCatalogProps {
  products: Product[]; // Expects an array of products
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products }) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching products (replace with actual API call)
    const fetchProducts = async () => {
      try {
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Simulate potential error
        // if (Math.random() < 0.2) {
        //   throw new Error("Failed to fetch products");
        // }

        setIsLoading(false);
        setFilteredProducts(products); // Initially show all products
      } catch (err: any) {
        setIsLoading(false);
        setError(err.message || "An error occurred while fetching products.");
      }
    };

    fetchProducts();
  }, [products]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(filtered);
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
        {filteredProducts.map(product => (
          <div key={product.id} className="product-item">
            <a href={`/product/${product.id}`}>
              <img src={product.imageUrl} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;

Now, I will use the `Write` tool to save the code to a file and the `Write` tool to save the build report.