import React, { useState, useCallback, useMemo } from 'react';

interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  imageUrl: string;
  features?: string[];
  sustainabilityMetrics?: {
    carbonFootprint?: number;
    esgScore?: number;
  };
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const cardStyle = useMemo(() => ({
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: isHovered ? '0 4px 8px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'box-shadow 0.3s ease',
    backgroundColor: 'white',
  }), [isHovered]);

  const imageStyle = useMemo(() => ({
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '4px',
    display: 'block',
  }), []);

  const buttonStyle = useMemo(() => ({
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  }), []);

  const sustainabilityMetricsExist = useMemo(() => {
    return product.sustainabilityMetrics && (product.sustainabilityMetrics.carbonFootprint != null || product.sustainabilityMetrics.esgScore != null);
  }, [product.sustainabilityMetrics]);

  return (
    <div
      className="product-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={cardStyle}
      aria-label={`Product: ${product.name}`}
    >
      {imageError ? (
        <div
          style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#eee',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#888', // Added color for better visibility
          }}
          role="img"
          aria-label="Image not available"
        >
          Image not available
        </div>
      ) : (
        <img
          src={product.imageUrl}
          alt={product.name}
          style={imageStyle}
          onError={handleImageError}
        />
      )}
      <h3>{product.name}</h3>
      <p>{product.description || 'No description available.'}</p>
      <p>Price: {product.price != null ? `$${product.price.toFixed(2)}` : 'N/A'}</p>

      {sustainabilityMetricsExist && (
        <div>
          <h4>Sustainability Metrics:</h4>
          <p>Carbon Footprint: {product.sustainabilityMetrics?.carbonFootprint != null ? product.sustainabilityMetrics.carbonFootprint : 'N/A'}</p>
          <p>ESG Score: {product.sustainabilityMetrics?.esgScore != null ? product.sustainabilityMetrics.esgScore : 'N/A'}</p>
        </div>
      )}

      <ul>
        {product.features && product.features.length > 0 ? (
          product.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))
        ) : (
          <li>No features listed.</li>
        )}
      </ul>
      <button style={buttonStyle}>Learn More</button>
    </div>
  );
};

interface ProductCatalogProps {
  products: Product[] | null | undefined;
  fallbackMessage?: React.ReactNode;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products, fallbackMessage = "No products available." }) => {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <div className="product-catalog error">
        <p>An error occurred while loading products.</p>
        <details>
          <summary>Error Details</summary>
          <p>{error.message}</p>
        </details>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <div className="product-catalog empty">{fallbackMessage}</div>;
  }

  return (
    <div className="product-catalog">
      {products.map((product) => {
        try {
          return <ProductCard key={product.id} product={product} />;
        } catch (e: any) {
          console.error("Error rendering product card:", e);
          setError(e instanceof Error ? e : new Error("Failed to render product card"));
          return null;
        }
      })}
    </div>
  );
};

export default ProductCatalog;

import React, { useState, useCallback, useMemo } from 'react';

interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  imageUrl: string;
  features?: string[];
  sustainabilityMetrics?: {
    carbonFootprint?: number;
    esgScore?: number;
  };
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const cardStyle = useMemo(() => ({
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: isHovered ? '0 4px 8px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'box-shadow 0.3s ease',
    backgroundColor: 'white',
  }), [isHovered]);

  const imageStyle = useMemo(() => ({
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '4px',
    display: 'block',
  }), []);

  const buttonStyle = useMemo(() => ({
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  }), []);

  const sustainabilityMetricsExist = useMemo(() => {
    return product.sustainabilityMetrics && (product.sustainabilityMetrics.carbonFootprint != null || product.sustainabilityMetrics.esgScore != null);
  }, [product.sustainabilityMetrics]);

  return (
    <div
      className="product-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={cardStyle}
      aria-label={`Product: ${product.name}`}
    >
      {imageError ? (
        <div
          style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#eee',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#888', // Added color for better visibility
          }}
          role="img"
          aria-label="Image not available"
        >
          Image not available
        </div>
      ) : (
        <img
          src={product.imageUrl}
          alt={product.name}
          style={imageStyle}
          onError={handleImageError}
        />
      )}
      <h3>{product.name}</h3>
      <p>{product.description || 'No description available.'}</p>
      <p>Price: {product.price != null ? `$${product.price.toFixed(2)}` : 'N/A'}</p>

      {sustainabilityMetricsExist && (
        <div>
          <h4>Sustainability Metrics:</h4>
          <p>Carbon Footprint: {product.sustainabilityMetrics?.carbonFootprint != null ? product.sustainabilityMetrics.carbonFootprint : 'N/A'}</p>
          <p>ESG Score: {product.sustainabilityMetrics?.esgScore != null ? product.sustainabilityMetrics.esgScore : 'N/A'}</p>
        </div>
      )}

      <ul>
        {product.features && product.features.length > 0 ? (
          product.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))
        ) : (
          <li>No features listed.</li>
        )}
      </ul>
      <button style={buttonStyle}>Learn More</button>
    </div>
  );
};

interface ProductCatalogProps {
  products: Product[] | null | undefined;
  fallbackMessage?: React.ReactNode;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products, fallbackMessage = "No products available." }) => {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <div className="product-catalog error">
        <p>An error occurred while loading products.</p>
        <details>
          <summary>Error Details</summary>
          <p>{error.message}</p>
        </details>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <div className="product-catalog empty">{fallbackMessage}</div>;
  }

  return (
    <div className="product-catalog">
      {products.map((product) => {
        try {
          return <ProductCard key={product.id} product={product} />;
        } catch (e: any) {
          console.error("Error rendering product card:", e);
          setError(e instanceof Error ? e : new Error("Failed to render product card"));
          return null;
        }
      })}
    </div>
  );
};

export default ProductCatalog;