// src/components/ProductCatalog.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '../types/Product'; // Assuming a Product type is defined
import { fetchProducts } from '../api/productService'; // Assuming an API service
import ErrorBoundary from './ErrorBoundary'; // Error boundary component
import './ProductCatalog.css'; // Styles

interface ProductCatalogProps {
  initialProducts?: Product[]; // For server-side rendering or initial data
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ initialProducts }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const newProducts = await fetchProducts(page);
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...newProducts]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (err: any) { // Explicitly type err as any to avoid type errors
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (!initialProducts) {
      loadProducts();
    } else {
      setLoading(false);
    }
  }, [loadProducts, initialProducts]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadProducts();
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <ErrorBoundary>
      <div className="product-catalog">
        <h1>Product Catalog</h1>
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <img src={product.imageUrl} alt={product.name} />
              <h2>{product.name}</h2>
              <p className="price">${product.price}</p>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
        {loading && <div className="loading">Loading...</div>}
        {hasMore && !loading && (
          <button onClick={handleLoadMore} className="load-more-button">
            Load More
          </button>
        )}
        {!hasMore && <div className="no-more-products">No more products to load.</div>}
      </div>
    </ErrorBoundary>
  );
};

export default ProductCatalog;

// src/components/ErrorBoundary.tsx
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught an error:", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// src/api/productService.ts
import { Product } from '../types/Product';

const API_ENDPOINT = 'https://api.example.com/products'; // Replace with your actual API endpoint

export const fetchProducts = async (page: number = 1, limit: number = 10): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_ENDPOINT}?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Re-throw the error to be caught by the component
  }
};

// src/types/Product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

// src/components/ProductCatalog.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '../types/Product'; // Assuming a Product type is defined
import { fetchProducts } from '../api/productService'; // Assuming an API service
import ErrorBoundary from './ErrorBoundary'; // Error boundary component
import './ProductCatalog.css'; // Styles

interface ProductCatalogProps {
  initialProducts?: Product[]; // For server-side rendering or initial data
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ initialProducts }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const newProducts = await fetchProducts(page);
      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...newProducts]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (err: any) { // Explicitly type err as any to avoid type errors
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (!initialProducts) {
      loadProducts();
    } else {
      setLoading(false);
    }
  }, [loadProducts, initialProducts]);

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadProducts();
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <ErrorBoundary>
      <div className="product-catalog">
        <h1>Product Catalog</h1>
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <img src={product.imageUrl} alt={product.name} />
              <h2>{product.name}</h2>
              <p className="price">${product.price}</p>
              <p>{product.description}</p>
            </div>
          ))}
        </div>
        {loading && <div className="loading">Loading...</div>}
        {hasMore && !loading && (
          <button onClick={handleLoadMore} className="load-more-button">
            Load More
          </button>
        )}
        {!hasMore && <div className="no-more-products">No more products to load.</div>}
      </div>
    </ErrorBoundary>
  );
};

export default ProductCatalog;

// src/components/ErrorBoundary.tsx
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught an error:", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// src/api/productService.ts
import { Product } from '../types/Product';

const API_ENDPOINT = 'https://api.example.com/products'; // Replace with your actual API endpoint

export const fetchProducts = async (page: number = 1, limit: number = 10): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_ENDPOINT}?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Re-throw the error to be caught by the component
  }
};

// src/types/Product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}