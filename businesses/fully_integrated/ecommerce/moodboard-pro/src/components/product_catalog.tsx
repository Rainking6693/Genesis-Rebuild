import React, { useState, useEffect, useCallback } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  features: string[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  const imageAltText = `Image of ${product.name}`;

  return (
    <div className="product-card" aria-label={product.name}>
      <div className="product-image-container">
        {imageLoading && (
          <div className="product-image-placeholder" aria-busy="true">
            Loading image...
          </div>
        )}
        {imageError && (
          <div className="product-image-error" role="alert">
            Image failed to load.
          </div>
        )}
        <img
          src={product.imageUrl}
          alt={imageAltText}
          className="product-image"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageLoading || imageError ? 'none' : 'block' }}
          loading="lazy" // Improves initial page load performance
        />
      </div>
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-price">Price: ${product.price.toFixed(2)}</p>
        <ul className="product-features">
          {product.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <button className="add-to-cart-button" aria-label={`Add ${product.name} to cart`}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

interface ProductCatalogProps {
  products: Product[] | null; // Allow null for initial loading state
  isLoading?: boolean;
  error?: string | null;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products, isLoading, error }) => {
  if (isLoading) {
    return <div aria-busy="true">Loading products...</div>;
  }

  if (error) {
    return (
      <div role="alert" className="error-message">
        Error: {error}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <div>No products found.</div>;
  }

  return (
    <div className="product-catalog">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

// Example Usage (replace with actual data fetching)
const useProducts = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Reset error on each fetch

      try {
        // Simulate fetching data from an API
        // const response = await fetch('/api/products');
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // const data: Product[] = await response.json();
        // setProducts(data);

        // Simulate a potential error
        // throw new Error("Failed to fetch products");

        const DUMMY_PRODUCTS: Product[] = [
          {
            id: 'mbp-standard',
            name: 'MoodBoard Pro - Standard',
            description: 'Core features for small teams. Includes basic mood tracking and team reports.',
            imageUrl: 'https://via.placeholder.com/150', // Replace with actual image URL
            price: 49.99,
            features: ['Basic Mood Tracking', 'Team Reports', 'Slack Integration'],
          },
          {
            id: 'mbp-premium',
            name: 'MoodBoard Pro - Premium',
            description: 'Advanced features for larger organizations. Includes personalized recommendations and burnout detection.',
            imageUrl: 'https://via.placeholder.com/150', // Replace with actual image URL
            price: 99.99,
            features: ['All Standard Features', 'Personalized Recommendations', 'Burnout Detection', 'Teams Integration'],
          },
          {
            id: 'mbp-enterprise',
            name: 'MoodBoard Pro - Enterprise',
            description: 'Customizable solution for enterprises. Includes dedicated support and advanced analytics.',
            imageUrl: 'https://via.placeholder.com/150', // Replace with actual image URL
            price: 299.99,
            features: ['All Premium Features', 'Dedicated Support', 'Advanced Analytics', 'Customizable Reports'],
          },
        ];
        setProducts(DUMMY_PRODUCTS);
      } catch (e: any) {
        console.error('Error fetching products:', e);
        setError('Failed to load products. Please try again later.'); // More user-friendly message
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { products, isLoading, error };
};

const ProductCatalogWrapper = () => {
  const { products, isLoading, error } = useProducts();

  return <ProductCatalog products={products} isLoading={isLoading} error={error} />;
};

export default ProductCatalogWrapper;

import React, { useState, useEffect, useCallback } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  features: string[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  const imageAltText = `Image of ${product.name}`;

  return (
    <div className="product-card" aria-label={product.name}>
      <div className="product-image-container">
        {imageLoading && (
          <div className="product-image-placeholder" aria-busy="true">
            Loading image...
          </div>
        )}
        {imageError && (
          <div className="product-image-error" role="alert">
            Image failed to load.
          </div>
        )}
        <img
          src={product.imageUrl}
          alt={imageAltText}
          className="product-image"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageLoading || imageError ? 'none' : 'block' }}
          loading="lazy" // Improves initial page load performance
        />
      </div>
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-price">Price: ${product.price.toFixed(2)}</p>
        <ul className="product-features">
          {product.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <button className="add-to-cart-button" aria-label={`Add ${product.name} to cart`}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

interface ProductCatalogProps {
  products: Product[] | null; // Allow null for initial loading state
  isLoading?: boolean;
  error?: string | null;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products, isLoading, error }) => {
  if (isLoading) {
    return <div aria-busy="true">Loading products...</div>;
  }

  if (error) {
    return (
      <div role="alert" className="error-message">
        Error: {error}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <div>No products found.</div>;
  }

  return (
    <div className="product-catalog">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

// Example Usage (replace with actual data fetching)
const useProducts = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Reset error on each fetch

      try {
        // Simulate fetching data from an API
        // const response = await fetch('/api/products');
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // const data: Product[] = await response.json();
        // setProducts(data);

        // Simulate a potential error
        // throw new Error("Failed to fetch products");

        const DUMMY_PRODUCTS: Product[] = [
          {
            id: 'mbp-standard',
            name: 'MoodBoard Pro - Standard',
            description: 'Core features for small teams. Includes basic mood tracking and team reports.',
            imageUrl: 'https://via.placeholder.com/150', // Replace with actual image URL
            price: 49.99,
            features: ['Basic Mood Tracking', 'Team Reports', 'Slack Integration'],
          },
          {
            id: 'mbp-premium',
            name: 'MoodBoard Pro - Premium',
            description: 'Advanced features for larger organizations. Includes personalized recommendations and burnout detection.',
            imageUrl: 'https://via.placeholder.com/150', // Replace with actual image URL
            price: 99.99,
            features: ['All Standard Features', 'Personalized Recommendations', 'Burnout Detection', 'Teams Integration'],
          },
          {
            id: 'mbp-enterprise',
            name: 'MoodBoard Pro - Enterprise',
            description: 'Customizable solution for enterprises. Includes dedicated support and advanced analytics.',
            imageUrl: 'https://via.placeholder.com/150', // Replace with actual image URL
            price: 299.99,
            features: ['All Premium Features', 'Dedicated Support', 'Advanced Analytics', 'Customizable Reports'],
          },
        ];
        setProducts(DUMMY_PRODUCTS);
      } catch (e: any) {
        console.error('Error fetching products:', e);
        setError('Failed to load products. Please try again later.'); // More user-friendly message
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { products, isLoading, error };
};

const ProductCatalogWrapper = () => {
  const { products, isLoading, error } = useProducts();

  return <ProductCatalog products={products} isLoading={isLoading} error={error} />;
};

export default ProductCatalogWrapper;