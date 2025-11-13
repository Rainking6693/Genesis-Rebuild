// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface ShoppingCartProps {
  // Add any necessary props here, e.g., a function to fetch product details
  fetchProductDetails: (productId: string) => Promise<CartItem | null>;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ fetchProductDetails }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load cart items from local storage or an API
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      try {
        setCartItems(JSON.parse(storedCartItems));
      } catch (parseError) {
        console.error("Error parsing cart items from local storage:", parseError);
        setError("Failed to load cart items.");
      }
    }
  }, []);

  useEffect(() => {
    // Save cart items to local storage whenever they change
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItemToCart = async (productId: string) => {
    setLoading(true);
    setError(null);

    try {
      const product = await fetchProductDetails(productId);

      if (!product) {
        setError(`Product with ID ${productId} not found.`);
        return;
      }

      const existingItemIndex = cartItems.findIndex((item) => item.id === productId);

      if (existingItemIndex !== -1) {
        // Item already exists in cart, update quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Item doesn't exist in cart, add it
        setCartItems([...cartItems, { ...product, quantity: 1 }]);
      }
    } catch (fetchError: any) {
      console.error("Error fetching product details:", fetchError);
      setError(`Failed to add product to cart: ${fetchError.message}`);
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromCart = (productId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  const updateItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      return; // Prevent negative quantities
    }

    const updatedCartItems = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCartItems);
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              <img src={item.imageUrl} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />
              {item.name} - ${item.price} x {item.quantity}
              <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItemFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${calculateTotalPrice()}</p>
      {/* Example usage of addItemToCart.  Replace with actual button/event handler */}
      {/* <button onClick={() => addItemToCart('some-product-id')}>Add Product</button> */}
    </div>
  );
};

export default ShoppingCart;

// src/components/ShoppingCart.tsx
import React, { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface ShoppingCartProps {
  // Add any necessary props here, e.g., a function to fetch product details
  fetchProductDetails: (productId: string) => Promise<CartItem | null>;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ fetchProductDetails }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load cart items from local storage or an API
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      try {
        setCartItems(JSON.parse(storedCartItems));
      } catch (parseError) {
        console.error("Error parsing cart items from local storage:", parseError);
        setError("Failed to load cart items.");
      }
    }
  }, []);

  useEffect(() => {
    // Save cart items to local storage whenever they change
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItemToCart = async (productId: string) => {
    setLoading(true);
    setError(null);

    try {
      const product = await fetchProductDetails(productId);

      if (!product) {
        setError(`Product with ID ${productId} not found.`);
        return;
      }

      const existingItemIndex = cartItems.findIndex((item) => item.id === productId);

      if (existingItemIndex !== -1) {
        // Item already exists in cart, update quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += 1;
        setCartItems(updatedCartItems);
      } else {
        // Item doesn't exist in cart, add it
        setCartItems([...cartItems, { ...product, quantity: 1 }]);
      }
    } catch (fetchError: any) {
      console.error("Error fetching product details:", fetchError);
      setError(`Failed to add product to cart: ${fetchError.message}`);
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromCart = (productId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  const updateItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      return; // Prevent negative quantities
    }

    const updatedCartItems = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCartItems);
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              <img src={item.imageUrl} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />
              {item.name} - ${item.price} x {item.quantity}
              <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => removeItemFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <p>Total: ${calculateTotalPrice()}</p>
      {/* Example usage of addItemToCart.  Replace with actual button/event handler */}
      {/* <button onClick={() => addItemToCart('some-product-id')}>Add Product</button> */}
    </div>
  );
};

export default ShoppingCart;