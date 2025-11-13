import React, { useState, useEffect, useCallback } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  carbonFootprintKg: number; // Estimated carbon footprint in kg
}

interface ProductCatalogProps {
  products: Product[] | null | undefined; // Allow null or undefined
  addToCart: (product: Product) => void; // Example prop for adding to cart
  loadingIndicator?: React.ReactNode; // Custom loading indicator
  emptyStateMessage?: string; // Custom message when no products are found
  errorMessage?: string; // Custom error message
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  addToCart,
  loadingIndicator = <p>Loading products...</p>,
  emptyStateMessage = 'No products found.',
  errorMessage = 'An error occurred. Please try again later.',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the filter function
  const filterProducts = useCallback(() => {
    setIsLoading(true);
    try {
      if (!products) {
        setSearchError(null); // Clear any previous error
        setFilteredProducts([]);
        return;
      }

      if (!Array.isArray(products)) {
        setSearchError('Invalid product data received.');
        setFilteredProducts([]);
        return;
      }

      const results = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(results);
      setSearchError(null);
    } catch (error) {
      console.error('Error filtering products:', error);
      setSearchError(errorMessage);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, products, errorMessage]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  useEffect(() => {
    if (products === null || products === undefined) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [products]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddToCart = (product: Product) => {
    if (addToCart) {
      addToCart(product);
    } else {
      console.warn('addToCart function not provided as a prop.');
    }
  };

  // Handle loading state
  if (isLoading) {
    return <div>{loadingIndicator}</div>;
  }

  // Handle error state
  if (searchError) {
    return <div className="error-message">{searchError}</div>;
  }

  return (
    <div className="product-catalog">
      <label htmlFor="product-search" className="product-catalog__label">
        Search products:
      </label>
      <input
        type="search" // Use type="search" for better UX
        id="product-search"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearch}
        aria-label="Search products"
        className="product-catalog__search-input"
      />

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <img
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150';
                  e.target.alt = 'Placeholder Image'; // Add alt text for placeholder
                }}
                className="product-card__image"
              />
              <h3 className="product-card__title">{product.name}</h3>
              <p className="product-card__description">
                {product.description || 'No description available.'}
              </p>
              <p className="product-card__price">
                Price: ${product.price?.toFixed(2) ?? 'N/A'}
              </p>
              <p className="product-card__carbon">
                Carbon Footprint: {product.carbonFootprintKg ?? 'N/A'} kg
              </p>
              <button onClick={() => handleAddToCart(product)} className="product-card__button">
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>{emptyStateMessage}</p>
        )}
      </div>

      <style jsx>{`
        .product-catalog {
          padding: 20px;
        }

        .product-catalog__label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .product-catalog__search-input {
          width: 100%;
          padding: 8px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .product-card {
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          transition: all 0.3s ease;

          &:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
        }

        .product-card__image {
          max-width: 100%;
          height: auto;
          margin-bottom: 10px;
          display: block; /* Removes extra space below image */
        }

        .product-card__title {
          font-size: 1.2rem;
          margin-bottom: 5px;
        }

        .product-card__description {
          font-size: 0.9rem;
          color: #555;
          margin-bottom: 10px;
        }

        .product-card__price,
        .product-card__carbon {
          font-size: 0.85rem;
          color: #777;
          margin-bottom: 8px;
        }

        .product-card__button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.2s ease;

          &:hover {
            background-color: #367c39;
          }
        }

        .error-message {
          color: red;
          margin-top: 10px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default ProductCatalog;

import React, { useState, useEffect, useCallback } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  carbonFootprintKg: number; // Estimated carbon footprint in kg
}

interface ProductCatalogProps {
  products: Product[] | null | undefined; // Allow null or undefined
  addToCart: (product: Product) => void; // Example prop for adding to cart
  loadingIndicator?: React.ReactNode; // Custom loading indicator
  emptyStateMessage?: string; // Custom message when no products are found
  errorMessage?: string; // Custom error message
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  addToCart,
  loadingIndicator = <p>Loading products...</p>,
  emptyStateMessage = 'No products found.',
  errorMessage = 'An error occurred. Please try again later.',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the filter function
  const filterProducts = useCallback(() => {
    setIsLoading(true);
    try {
      if (!products) {
        setSearchError(null); // Clear any previous error
        setFilteredProducts([]);
        return;
      }

      if (!Array.isArray(products)) {
        setSearchError('Invalid product data received.');
        setFilteredProducts([]);
        return;
      }

      const results = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(results);
      setSearchError(null);
    } catch (error) {
      console.error('Error filtering products:', error);
      setSearchError(errorMessage);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, products, errorMessage]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  useEffect(() => {
    if (products === null || products === undefined) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [products]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddToCart = (product: Product) => {
    if (addToCart) {
      addToCart(product);
    } else {
      console.warn('addToCart function not provided as a prop.');
    }
  };

  // Handle loading state
  if (isLoading) {
    return <div>{loadingIndicator}</div>;
  }

  // Handle error state
  if (searchError) {
    return <div className="error-message">{searchError}</div>;
  }

  return (
    <div className="product-catalog">
      <label htmlFor="product-search" className="product-catalog__label">
        Search products:
      </label>
      <input
        type="search" // Use type="search" for better UX
        id="product-search"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearch}
        aria-label="Search products"
        className="product-catalog__search-input"
      />

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <img
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150';
                  e.target.alt = 'Placeholder Image'; // Add alt text for placeholder
                }}
                className="product-card__image"
              />
              <h3 className="product-card__title">{product.name}</h3>
              <p className="product-card__description">
                {product.description || 'No description available.'}
              </p>
              <p className="product-card__price">
                Price: ${product.price?.toFixed(2) ?? 'N/A'}
              </p>
              <p className="product-card__carbon">
                Carbon Footprint: {product.carbonFootprintKg ?? 'N/A'} kg
              </p>
              <button onClick={() => handleAddToCart(product)} className="product-card__button">
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>{emptyStateMessage}</p>
        )}
      </div>

      <style jsx>{`
        .product-catalog {
          padding: 20px;
        }

        .product-catalog__label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .product-catalog__search-input {
          width: 100%;
          padding: 8px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .product-card {
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          transition: all 0.3s ease;

          &:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
        }

        .product-card__image {
          max-width: 100%;
          height: auto;
          margin-bottom: 10px;
          display: block; /* Removes extra space below image */
        }

        .product-card__title {
          font-size: 1.2rem;
          margin-bottom: 5px;
        }

        .product-card__description {
          font-size: 0.9rem;
          color: #555;
          margin-bottom: 10px;
        }

        .product-card__price,
        .product-card__carbon {
          font-size: 0.85rem;
          color: #777;
          margin-bottom: 8px;
        }

        .product-card__button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.2s ease;

          &:hover {
            background-color: #367c39;
          }
        }

        .error-message {
          color: red;
          margin-top: 10px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default ProductCatalog;