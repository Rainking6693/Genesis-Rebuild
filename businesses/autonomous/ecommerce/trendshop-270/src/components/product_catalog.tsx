// src/components/ProductCatalog.tsx
import React, { useState, useEffect } from 'react';
import { Product } from '../types/Product'; // Assuming a Product type is defined

interface ProductCatalogProps {
  products: Product[];
  itemsPerPage?: number;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products, itemsPerPage = 12 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  useEffect(() => {
    try {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const currentProducts = products.slice(startIndex, endIndex);
      setDisplayedProducts(currentProducts);
    } catch (e: any) {
      console.error("Error slicing products:", e);
      setError("Failed to load products. Please try again later.");
    }
  }, [currentPage, itemsPerPage, products]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (error) {
    return (
      <div className="error-message">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="product-catalog">
      {displayedProducts.length > 0 ? (
        <div className="product-list">
          {displayedProducts.map((product) => (
            <div key={product.id} className="product-item">
              <img src={product.imageUrl} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>${product.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-products">No products found.</div>
      )}

      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductCatalog;