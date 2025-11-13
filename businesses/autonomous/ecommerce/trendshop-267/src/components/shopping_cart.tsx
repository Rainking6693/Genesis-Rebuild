// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  initialItems?: CartItem[];
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ initialItems = [] }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      // Simulate fetching cart items from an API
      setTimeout(() => {
        // Example items
        const fetchedItems: CartItem[] = [
          { id: '1', name: 'Product A', price: 20, quantity: 1 },
          { id: '2', name: 'Product B', price: 30, quantity: 2 },
        ];
        setCartItems(fetchedItems);
        updateTotal(fetchedItems);
        setLoading(false);
      }, 500); // Simulate network latency
    } catch (e: any) {
      setError(`Failed to load cart items: ${e.message}`);
      setLoading(false);
    }
  }, []);

  const updateTotal = (items: CartItem[]) => {
    const newTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      const updatedItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      updateTotal(updatedItems);
    } catch (e: any) {
      setError(`Error updating quantity: ${e.message}`);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    try {
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      updateTotal(updatedItems);
    } catch (e: any) {
      setError(`Error removing item: ${e.message}`);
    }
  };

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price} x
              <input
                type="number"
                value={item.quantity}
                min="0"
                onChange={(e) => {
                  const quantity = parseInt(e.target.value);
                  if (!isNaN(quantity)) {
                    handleQuantityChange(item.id, quantity);
                  }
                }}
              />
              <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${total.toFixed(2)}</p>
      {/* Error Boundary Example */}
      <ErrorBoundary>
        <CheckoutButton total={total} />
      </ErrorBoundary>
    </div>
  );
};

interface CheckoutButtonProps {
  total: number;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ total }) => {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (total <= 0) {
        throw new Error("Cart total must be greater than zero to checkout.");
      }
      alert('Checkout successful!');
    } catch (e: any) {
      setCheckoutError(`Checkout failed: ${e.message}`);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (checkoutLoading) {
    return <button disabled>Processing...</button>;
  }

  if (checkoutError) {
    return <div style={{ color: 'red' }}>{checkoutError}</div>;
  }

  return <button onClick={handleCheckout}>Checkout</button>;
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught error: ", error, errorInfo);
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

export default ShoppingCart;

// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShoppingCartProps {
  initialItems?: CartItem[];
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ initialItems = [] }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      // Simulate fetching cart items from an API
      setTimeout(() => {
        // Example items
        const fetchedItems: CartItem[] = [
          { id: '1', name: 'Product A', price: 20, quantity: 1 },
          { id: '2', name: 'Product B', price: 30, quantity: 2 },
        ];
        setCartItems(fetchedItems);
        updateTotal(fetchedItems);
        setLoading(false);
      }, 500); // Simulate network latency
    } catch (e: any) {
      setError(`Failed to load cart items: ${e.message}`);
      setLoading(false);
    }
  }, []);

  const updateTotal = (items: CartItem[]) => {
    const newTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) {
        throw new Error("Quantity cannot be negative.");
      }

      const updatedItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      updateTotal(updatedItems);
    } catch (e: any) {
      setError(`Error updating quantity: ${e.message}`);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    try {
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      updateTotal(updatedItems);
    } catch (e: any) {
      setError(`Error removing item: ${e.message}`);
    }
  };

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price} x
              <input
                type="number"
                value={item.quantity}
                min="0"
                onChange={(e) => {
                  const quantity = parseInt(e.target.value);
                  if (!isNaN(quantity)) {
                    handleQuantityChange(item.id, quantity);
                  }
                }}
              />
              <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${total.toFixed(2)}</p>
      {/* Error Boundary Example */}
      <ErrorBoundary>
        <CheckoutButton total={total} />
      </ErrorBoundary>
    </div>
  );
};

interface CheckoutButtonProps {
  total: number;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ total }) => {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      // Simulate checkout process
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (total <= 0) {
        throw new Error("Cart total must be greater than zero to checkout.");
      }
      alert('Checkout successful!');
    } catch (e: any) {
      setCheckoutError(`Checkout failed: ${e.message}`);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (checkoutLoading) {
    return <button disabled>Processing...</button>;
  }

  if (checkoutError) {
    return <div style={{ color: 'red' }}>{checkoutError}</div>;
  }

  return <button onClick={handleCheckout}>Checkout</button>;
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught error: ", error, errorInfo);
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

export default ShoppingCart;