import React, { useState, useEffect, useCallback, Suspense } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  sustainabilityScore: number; // Score reflecting environmental impact
  ecoLabels: string[]; // Certifications and labels (e.g., "Fair Trade", "Organic")
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void; // Optional callback for adding to cart
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  const handleAddToCartClick = useCallback(() => {
    if (onAddToCart) {
      try {
        onAddToCart(product.id);
      } catch (e) {
        console.error("Error adding to cart:", e);
        alert("Failed to add to cart. Please try again."); // User feedback
      }
    }
  }, [onAddToCart, product.id]);

  const priceFormatted = typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A';
  const sustainabilityScoreFormatted = typeof product.sustainabilityScore === 'number' ? product.sustainabilityScore.toFixed(0) : 'N/A';

  return (
    <div className="product-card" aria-label={`Product: ${product.name}`}>
      <div className="product-image-container">
        {imageLoading && (
          <div className="product-image-placeholder" aria-hidden="true">
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
          alt={product.name}
          className="product-image"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageLoading || imageError ? 'none' : 'block' }}
        />
      </div>

      <h3 className="product-name">{product.name}</h3>
      <p className="product-description">{product.description || 'No description available.'}</p>
      <p className="product-price">Price: ${priceFormatted}</p>
      <p className="product-sustainability">Sustainability Score: {sustainabilityScoreFormatted}</p>

      <div className="product-eco-labels">
        {product.ecoLabels && product.ecoLabels.length > 0 ? (
          product.ecoLabels.map((label) => (
            <span key={label} className="eco-label">
              {label}
            </span>
          ))
        ) : (
          <span className="no-eco-labels">No eco-labels available.</span>
        )}
      </div>

      <button
        className="add-to-cart-button"
        onClick={handleAddToCartClick}
        aria-label={`Add ${product.name} to cart`}
        disabled={imageLoading || imageError}
      >
        Add to Cart
      </button>
    </div>
  );
};

interface ProductListProps {
  products: Product[] | null | undefined;
  onAddToCart?: (productId: string) => void; // Optional callback, passed down to ProductCard
  fallbackComponent?: React.ReactNode; // Optional component to render when product list is empty or errors
  loadingComponent?: React.ReactNode; // Optional component to show while loading
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart, fallbackComponent, loadingComponent }) => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (!products) {
      setError(new Error("Product list is undefined or null."));
      setIsLoading(false);
    } else {
      setError(null);
      setIsLoading(false);
    }
  }, [products]);

  if (isLoading) {
    return (
      <div className="product-list-loading">
        {loadingComponent || <p>Loading products...</p>}
      </div>
    );
  }

  if (error) {
    console.error("Error in ProductList:", error);
    return (
      <div className="product-list-error" role="alert">
        <p>Error loading product list.</p>
        {fallbackComponent || <p>Please try again later.</p>}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="product-list-empty">
        <p>No products found.</p>
        {fallbackComponent || <p>Check back soon!</p>}
      </div>
    );
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

export default ProductList;

import React, { useState, useEffect, useCallback, Suspense } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  sustainabilityScore: number; // Score reflecting environmental impact
  ecoLabels: string[]; // Certifications and labels (e.g., "Fair Trade", "Organic")
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void; // Optional callback for adding to cart
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  const handleAddToCartClick = useCallback(() => {
    if (onAddToCart) {
      try {
        onAddToCart(product.id);
      } catch (e) {
        console.error("Error adding to cart:", e);
        alert("Failed to add to cart. Please try again."); // User feedback
      }
    }
  }, [onAddToCart, product.id]);

  const priceFormatted = typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A';
  const sustainabilityScoreFormatted = typeof product.sustainabilityScore === 'number' ? product.sustainabilityScore.toFixed(0) : 'N/A';

  return (
    <div className="product-card" aria-label={`Product: ${product.name}`}>
      <div className="product-image-container">
        {imageLoading && (
          <div className="product-image-placeholder" aria-hidden="true">
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
          alt={product.name}
          className="product-image"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageLoading || imageError ? 'none' : 'block' }}
        />
      </div>

      <h3 className="product-name">{product.name}</h3>
      <p className="product-description">{product.description || 'No description available.'}</p>
      <p className="product-price">Price: ${priceFormatted}</p>
      <p className="product-sustainability">Sustainability Score: {sustainabilityScoreFormatted}</p>

      <div className="product-eco-labels">
        {product.ecoLabels && product.ecoLabels.length > 0 ? (
          product.ecoLabels.map((label) => (
            <span key={label} className="eco-label">
              {label}
            </span>
          ))
        ) : (
          <span className="no-eco-labels">No eco-labels available.</span>
        )}
      </div>

      <button
        className="add-to-cart-button"
        onClick={handleAddToCartClick}
        aria-label={`Add ${product.name} to cart`}
        disabled={imageLoading || imageError}
      >
        Add to Cart
      </button>
    </div>
  );
};

interface ProductListProps {
  products: Product[] | null | undefined;
  onAddToCart?: (productId: string) => void; // Optional callback, passed down to ProductCard
  fallbackComponent?: React.ReactNode; // Optional component to render when product list is empty or errors
  loadingComponent?: React.ReactNode; // Optional component to show while loading
}

const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart, fallbackComponent, loadingComponent }) => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (!products) {
      setError(new Error("Product list is undefined or null."));
      setIsLoading(false);
    } else {
      setError(null);
      setIsLoading(false);
    }
  }, [products]);

  if (isLoading) {
    return (
      <div className="product-list-loading">
        {loadingComponent || <p>Loading products...</p>}
      </div>
    );
  }

  if (error) {
    console.error("Error in ProductList:", error);
    return (
      <div className="product-list-error" role="alert">
        <p>Error loading product list.</p>
        {fallbackComponent || <p>Please try again later.</p>}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="product-list-empty">
        <p>No products found.</p>
        {fallbackComponent || <p>Check back soon!</p>}
      </div>
    );
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

export default ProductList;