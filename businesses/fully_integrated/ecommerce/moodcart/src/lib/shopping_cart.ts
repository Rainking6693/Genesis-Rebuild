import { Product } from './Product';

class ShoppingCart {
  private items: { [key: number]: Product } = {};

  addItem(product: Product, quantity: number): void {
    if (quantity < 1) {
      throw new Error('Invalid quantity');
    }

    if (!this.items[product.id]) {
      this.items[product.id] = { ...product, quantity };
    } else {
      this.items[product.id].quantity += quantity;
    }
  }

  removeItem(productId: number, quantityToRemove: number = 1): void {
    if (!this.items[productId]) {
      throw new Error('Product not found');
    }

    if (this.items[productId].quantity < quantityToRemove) {
      throw new Error('Insufficient quantity');
    }

    this.items[productId].quantity -= quantityToRemove;

    if (this.items[productId].quantity === 0) {
      delete this.items[productId];
    }
  }

  getItems(): Product[] {
    return Object.values(this.items);
  }

  getTotalCost(): number {
    let totalCost = 0;

    for (const item of this.getItems()) {
      totalCost += item.price * item.quantity;
    }

    return totalCost;
  }

  // Accessibility: Provide ARIA attributes for screen readers
  render(): string {
    let html = '<ul>';

    for (const item of this.getItems()) {
      html += `<li data-testid="item-${item.id}">${item.name} - ${item.quantity} x ${item.price} = ${(item.price * item.quantity).toFixed(2)}</li>`;
    }

    html += `<li>Total: ${this.getTotalCost().toFixed(2)}</li></ul>`;

    return html;
  }
}

export { ShoppingCart };

import { Product } from './Product';

class ShoppingCart {
  private items: { [key: number]: Product } = {};

  addItem(product: Product, quantity: number): void {
    if (quantity < 1) {
      throw new Error('Invalid quantity');
    }

    if (!this.items[product.id]) {
      this.items[product.id] = { ...product, quantity };
    } else {
      this.items[product.id].quantity += quantity;
    }
  }

  removeItem(productId: number, quantityToRemove: number = 1): void {
    if (!this.items[productId]) {
      throw new Error('Product not found');
    }

    if (this.items[productId].quantity < quantityToRemove) {
      throw new Error('Insufficient quantity');
    }

    this.items[productId].quantity -= quantityToRemove;

    if (this.items[productId].quantity === 0) {
      delete this.items[productId];
    }
  }

  getItems(): Product[] {
    return Object.values(this.items);
  }

  getTotalCost(): number {
    let totalCost = 0;

    for (const item of this.getItems()) {
      totalCost += item.price * item.quantity;
    }

    return totalCost;
  }

  // Accessibility: Provide ARIA attributes for screen readers
  render(): string {
    let html = '<ul>';

    for (const item of this.getItems()) {
      html += `<li data-testid="item-${item.id}">${item.name} - ${item.quantity} x ${item.price} = ${(item.price * item.quantity).toFixed(2)}</li>`;
    }

    html += `<li>Total: ${this.getTotalCost().toFixed(2)}</li></ul>`;

    return html;
  }
}

export { ShoppingCart };