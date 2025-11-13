import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  cost: number;
  competitorPrice?: number;
}

interface ProductCatalogProps {
  products: Product[];
  onPriceChange: (productId: string, newPrice: number) => void;
  placeholderImageUrl?: string; // Allow customization of the placeholder image
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products, onPriceChange, placeholderImageUrl = "placeholder_image_url.png" }) => {
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Add loading state

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  const handlePriceUpdate = useCallback(
    (productId: string, newPrice: number) => {
      if (newPrice < 0) {
        setError("Price cannot be negative.");
        return;
      }

      if (isNaN(newPrice)) {
        setError("Invalid price input.");
        return;
      }

      setLoading(true); // Start loading
      setError(null); // Clear previous errors

      const updatedProducts = localProducts.map((product) =>
        product.id === productId ? { ...product, price: newPrice } : product
      );
      setLocalProducts(updatedProducts);

      onPriceChange(productId, newPrice)
        .then(() => {
          setError(null); // Clear any previous errors on success
        })
        .catch((e) => {
          console.error("Failed to update price in parent component:", e);
          setError("Failed to update price. Please try again.");

          // Revert local state on failure
          setLocalProducts(products); // Revert to original products
        })
        .finally(() => {
          setLoading(false); // End loading
        });
    },
    [localProducts, onPriceChange, products]
  );

  const calculateProfitMargin = useCallback((product: Product) => {
    if (product.price <= 0) {
      return "N/A"; // Avoid division by zero and handle cases where price is invalid
    }
    const profitMargin = ((product.price - product.cost) / product.price) * 100;
    return profitMargin.toFixed(2);
  }, []);

  const handleImageError = useCallback((event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = event.target as HTMLImageElement;
    target.onerror = null; // Prevent infinite loop
    target.src = placeholderImageUrl;
  }, [placeholderImageUrl]);

  const handleInputChange = useCallback((productId: string, event: ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseFloat(event.target.value);
    if (!isNaN(newPrice)) {
      handlePriceUpdate(productId, newPrice);
    } else if (event.target.value !== "") {
      setError("Invalid price input.");
    } else {
      // Clear error if input is empty and was previously invalid
      setError(null);
    }
  }, [handlePriceUpdate]);

  return (
    <div aria-live="polite"> {/* Accessibility: Announce updates */}
      <h2>Product Catalog</h2>
      {error && <div style={{ color: 'red' }} role="alert">{error}</div>} {/* Accessibility: Use role="alert" */}
      {loading && <div>Updating price...</div>} {/* Indicate loading state */}
      {localProducts.length === 0 ? (
        <p>No products available.</p>
      ) : (
        localProducts.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <img
              src={product.imageUrl || placeholderImageUrl}
              alt={product.name}
              style={{ maxWidth: '100px', maxHeight: '100px', display: 'block' }}
              onError={handleImageError}
            />
            <h3>{product.name}</h3>
            <p>{product.description || "No description available."}</p>
            <p>Current Price: ${product.price.toFixed(2)}</p>
            <p>Cost: ${product.cost.toFixed(2)}</p>
            <p>Profit Margin: {calculateProfitMargin(product)}%</p>
            {product.competitorPrice !== undefined && (
              <p>Competitor Price: ${product.competitorPrice.toFixed(2)}</p>
            )}
            <div>
              <label htmlFor={`price-${product.id}`}>New Price:</label>
              <input
                type="number"
                id={`price-${product.id}`}
                value={localProducts.find((p) => p.id === product.id)?.price || product.price}
                onChange={(e) => handleInputChange(product.id, e)}
                aria-label={`New price for ${product.name}`}
                min="0" // Ensure only positive values can be entered
                step="0.01" // Allow decimal values
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductCatalog;

import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  cost: number;
  competitorPrice?: number;
}

interface ProductCatalogProps {
  products: Product[];
  onPriceChange: (productId: string, newPrice: number) => void;
  placeholderImageUrl?: string; // Allow customization of the placeholder image
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products, onPriceChange, placeholderImageUrl = "placeholder_image_url.png" }) => {
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Add loading state

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  const handlePriceUpdate = useCallback(
    (productId: string, newPrice: number) => {
      if (newPrice < 0) {
        setError("Price cannot be negative.");
        return;
      }

      if (isNaN(newPrice)) {
        setError("Invalid price input.");
        return;
      }

      setLoading(true); // Start loading
      setError(null); // Clear previous errors

      const updatedProducts = localProducts.map((product) =>
        product.id === productId ? { ...product, price: newPrice } : product
      );
      setLocalProducts(updatedProducts);

      onPriceChange(productId, newPrice)
        .then(() => {
          setError(null); // Clear any previous errors on success
        })
        .catch((e) => {
          console.error("Failed to update price in parent component:", e);
          setError("Failed to update price. Please try again.");

          // Revert local state on failure
          setLocalProducts(products); // Revert to original products
        })
        .finally(() => {
          setLoading(false); // End loading
        });
    },
    [localProducts, onPriceChange, products]
  );

  const calculateProfitMargin = useCallback((product: Product) => {
    if (product.price <= 0) {
      return "N/A"; // Avoid division by zero and handle cases where price is invalid
    }
    const profitMargin = ((product.price - product.cost) / product.price) * 100;
    return profitMargin.toFixed(2);
  }, []);

  const handleImageError = useCallback((event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = event.target as HTMLImageElement;
    target.onerror = null; // Prevent infinite loop
    target.src = placeholderImageUrl;
  }, [placeholderImageUrl]);

  const handleInputChange = useCallback((productId: string, event: ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseFloat(event.target.value);
    if (!isNaN(newPrice)) {
      handlePriceUpdate(productId, newPrice);
    } else if (event.target.value !== "") {
      setError("Invalid price input.");
    } else {
      // Clear error if input is empty and was previously invalid
      setError(null);
    }
  }, [handlePriceUpdate]);

  return (
    <div aria-live="polite"> {/* Accessibility: Announce updates */}
      <h2>Product Catalog</h2>
      {error && <div style={{ color: 'red' }} role="alert">{error}</div>} {/* Accessibility: Use role="alert" */}
      {loading && <div>Updating price...</div>} {/* Indicate loading state */}
      {localProducts.length === 0 ? (
        <p>No products available.</p>
      ) : (
        localProducts.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <img
              src={product.imageUrl || placeholderImageUrl}
              alt={product.name}
              style={{ maxWidth: '100px', maxHeight: '100px', display: 'block' }}
              onError={handleImageError}
            />
            <h3>{product.name}</h3>
            <p>{product.description || "No description available."}</p>
            <p>Current Price: ${product.price.toFixed(2)}</p>
            <p>Cost: ${product.cost.toFixed(2)}</p>
            <p>Profit Margin: {calculateProfitMargin(product)}%</p>
            {product.competitorPrice !== undefined && (
              <p>Competitor Price: ${product.competitorPrice.toFixed(2)}</p>
            )}
            <div>
              <label htmlFor={`price-${product.id}`}>New Price:</label>
              <input
                type="number"
                id={`price-${product.id}`}
                value={localProducts.find((p) => p.id === product.id)?.price || product.price}
                onChange={(e) => handleInputChange(product.id, e)}
                aria-label={`New price for ${product.name}`}
                min="0" // Ensure only positive values can be entered
                step="0.01" // Allow decimal values
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductCatalog;