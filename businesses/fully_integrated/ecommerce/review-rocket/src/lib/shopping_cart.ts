import { SecurityService } from '@services';
import { ShoppingCartItem } from '@models';

export interface ShoppingCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ShoppingCartProps {
  /**
   * Unique identifier for the shopping cart
   */
  id: string;

  /**
   * Current items in the shopping cart
   */
  items: ShoppingCartItem[];

  /**
   * Total price of the items in the shopping cart
   */
  totalPrice: number;

  /**
   * Function to add an item to the shopping cart
   */
  addItem: (item: ShoppingCartItem) => void;

  /**
   * Function to remove an item from the shopping cart
   */
  removeItem: (itemId: string) => void;

  /**
   * Function to update the quantity of an item in the shopping cart
   */
  updateQuantity: (itemId: string, quantity: number) => void;
}

export class ShoppingCart extends React.Component<ShoppingCartProps> {
  constructor(props: ShoppingCartProps) {
    super(props);

    // Initialize state with the current shopping cart data
    this.state = {
      items: props.items,
      totalPrice: props.totalPrice,
    };
  }

  /**
   * Add an item to the shopping cart
   */
  addItemToCart = (item: ShoppingCartItem) => {
    // Validate the item before adding it to the cart
    if (!item) {
      console.error('Invalid item provided');
      return;
    }

    // Check if the item already exists in the cart
    const existingItemIndex = this.state.items.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex !== -1) {
      // If the item already exists, update its quantity
      this.updateQuantity(item.id, this.state.items[existingItemIndex].quantity + 1);
    } else {
      // If the item doesn't exist, add it to the cart
      this.props.addItem(item);
    }

    // Update the state with the new shopping cart data
    this.setState({
      items: this.props.items,
      totalPrice: this.props.totalPrice,
    });
  };

  /**
   * Remove an item from the shopping cart
   */
  removeItemFromCart = (itemId: string) => {
    // Validate the itemId before removing it from the cart
    if (!itemId) {
      console.error('Invalid item ID provided');
      return;
    }

    // Find the item to be removed
    const itemIndex = this.state.items.findIndex((item) => item.id === itemId);

    if (itemIndex !== -1) {
      // If the item exists, remove it from the cart
      this.props.removeItem(itemId);

      // Update the state with the new shopping cart data
      this.setState({
        items: this.props.items,
        totalPrice: this.props.totalPrice,
      });
    } else {
      console.error(`Item with ID ${itemId} not found in the cart`);
    }
  };

  /**
   * Update the quantity of an item in the shopping cart
   */
  updateQuantityOfItem = (itemId: string, quantity: number) => {
    // Validate the itemId and quantity before updating the item in the cart
    if (!itemId || !quantity || quantity <= 0) {
      console.error('Invalid item ID or quantity provided');
      return;
    }

    // Find the item to be updated
    const itemIndex = this.state.items.findIndex((item) => item.id === itemId);

    if (itemIndex !== -1) {
      // If the item exists, update its quantity in the cart
      this.props.updateQuantity(itemId, quantity);

      // Update the state with the new shopping cart data
      this.setState({
        items: this.props.items,
        totalPrice: this.props.totalPrice,
      });
    } else {
      console.error(`Item with ID ${itemId} not found in the cart`);
    }
  };

  /**
   * Check if the shopping cart is empty
   */
  isEmpty = () => this.state.items.length === 0;

  /**
   * Calculate the total price of the items in the shopping cart
   */
  getTotalPrice = () => {
    let totalPrice = 0;

    this.state.items.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });

    return totalPrice;
  };

  /**
   * Secure the shopping cart component by validating user permissions
   */
  componentDidMount() {
    const securityService = new SecurityService();
    const isAuthenticated = securityService.isAuthenticated();

    if (!isAuthenticated) {
      console.error('Unauthorized access to the shopping cart');
      // Redirect the user to the login page or display an error message
    }
  }

  render() {
    return (
      <div>
        {/* Render the shopping cart UI components */}
        <div role="list">
          {this.state.items.map((item) => (
            <div role="listitem" key={item.id}>
              <div>{item.name}</div>
              <div>{item.quantity}</div>
              <div>{item.price}</div>
              {/* Add actions (add, remove, update quantity) */}
            </div>
          ))}
        </div>
        <div>Total: {this.getTotalPrice()}</div>
      </div>
    );
  }
}

import { SecurityService } from '@services';
import { ShoppingCartItem } from '@models';

export interface ShoppingCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ShoppingCartProps {
  /**
   * Unique identifier for the shopping cart
   */
  id: string;

  /**
   * Current items in the shopping cart
   */
  items: ShoppingCartItem[];

  /**
   * Total price of the items in the shopping cart
   */
  totalPrice: number;

  /**
   * Function to add an item to the shopping cart
   */
  addItem: (item: ShoppingCartItem) => void;

  /**
   * Function to remove an item from the shopping cart
   */
  removeItem: (itemId: string) => void;

  /**
   * Function to update the quantity of an item in the shopping cart
   */
  updateQuantity: (itemId: string, quantity: number) => void;
}

export class ShoppingCart extends React.Component<ShoppingCartProps> {
  constructor(props: ShoppingCartProps) {
    super(props);

    // Initialize state with the current shopping cart data
    this.state = {
      items: props.items,
      totalPrice: props.totalPrice,
    };
  }

  /**
   * Add an item to the shopping cart
   */
  addItemToCart = (item: ShoppingCartItem) => {
    // Validate the item before adding it to the cart
    if (!item) {
      console.error('Invalid item provided');
      return;
    }

    // Check if the item already exists in the cart
    const existingItemIndex = this.state.items.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex !== -1) {
      // If the item already exists, update its quantity
      this.updateQuantity(item.id, this.state.items[existingItemIndex].quantity + 1);
    } else {
      // If the item doesn't exist, add it to the cart
      this.props.addItem(item);
    }

    // Update the state with the new shopping cart data
    this.setState({
      items: this.props.items,
      totalPrice: this.props.totalPrice,
    });
  };

  /**
   * Remove an item from the shopping cart
   */
  removeItemFromCart = (itemId: string) => {
    // Validate the itemId before removing it from the cart
    if (!itemId) {
      console.error('Invalid item ID provided');
      return;
    }

    // Find the item to be removed
    const itemIndex = this.state.items.findIndex((item) => item.id === itemId);

    if (itemIndex !== -1) {
      // If the item exists, remove it from the cart
      this.props.removeItem(itemId);

      // Update the state with the new shopping cart data
      this.setState({
        items: this.props.items,
        totalPrice: this.props.totalPrice,
      });
    } else {
      console.error(`Item with ID ${itemId} not found in the cart`);
    }
  };

  /**
   * Update the quantity of an item in the shopping cart
   */
  updateQuantityOfItem = (itemId: string, quantity: number) => {
    // Validate the itemId and quantity before updating the item in the cart
    if (!itemId || !quantity || quantity <= 0) {
      console.error('Invalid item ID or quantity provided');
      return;
    }

    // Find the item to be updated
    const itemIndex = this.state.items.findIndex((item) => item.id === itemId);

    if (itemIndex !== -1) {
      // If the item exists, update its quantity in the cart
      this.props.updateQuantity(itemId, quantity);

      // Update the state with the new shopping cart data
      this.setState({
        items: this.props.items,
        totalPrice: this.props.totalPrice,
      });
    } else {
      console.error(`Item with ID ${itemId} not found in the cart`);
    }
  };

  /**
   * Check if the shopping cart is empty
   */
  isEmpty = () => this.state.items.length === 0;

  /**
   * Calculate the total price of the items in the shopping cart
   */
  getTotalPrice = () => {
    let totalPrice = 0;

    this.state.items.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });

    return totalPrice;
  };

  /**
   * Secure the shopping cart component by validating user permissions
   */
  componentDidMount() {
    const securityService = new SecurityService();
    const isAuthenticated = securityService.isAuthenticated();

    if (!isAuthenticated) {
      console.error('Unauthorized access to the shopping cart');
      // Redirect the user to the login page or display an error message
    }
  }

  render() {
    return (
      <div>
        {/* Render the shopping cart UI components */}
        <div role="list">
          {this.state.items.map((item) => (
            <div role="listitem" key={item.id}>
              <div>{item.name}</div>
              <div>{item.quantity}</div>
              <div>{item.price}</div>
              {/* Add actions (add, remove, update quantity) */}
            </div>
          ))}
        </div>
        <div>Total: {this.getTotalPrice()}</div>
      </div>
    );
  }
}