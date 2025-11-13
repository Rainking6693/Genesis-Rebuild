import { Product } from './product';
import { IProduct, IProductValidator, IProductCatalog, IProductValidatorMethods } from './interfaces';

export class ProductCatalog implements IProductCatalog {
  private products: Product[];
  private productValidator: ProductValidator;

  constructor(productValidator: ProductValidator) {
    this.products = [];
    this.productValidator = productValidator;
  }

  public addProduct(product: Product): void {
    this.productValidator.validateProduct(product);
    this.products.push(product);
  }

  public getProducts(): IProduct[] {
    return this.products.map((product) => product.toJSON());
  }

  public getProductById(id: number): Product | undefined {
    const product = this.products.find((product) => product.id === id);
    this.productValidator.validateProductId(product, id);
    return product;
  }

  public updateProduct(id: number, updatedProduct: Partial<Product>): void {
    const product = this.getProductById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    this.productValidator.validateUpdate(updatedProduct);
    this.productValidator.validateUpdateProduct(product, updatedProduct);
    Object.assign(product, updatedProduct);
  }

  public deleteProduct(id: number): void {
    const product = this.getProductById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    this.productValidator.validateDelete(id);
    this.products = this.products.filter((product) => product.id !== id);
  }
}

export interface IProduct {
  id: number;
  name: string;
  description: string;
  carbonOffset: number;
  impactReport: string;
}

export interface IProductValidator {
  validate: (value: any, key: string) => void;
  validateProduct: (product: IProduct) => void;
  validateUpdate: (updatedProduct: Partial<IProduct>) => void;
  validateUpdateProduct: (product: Product, updatedProduct: Partial<Product>) => void;
  validateId: (id: number) => void;
  validateDelete: (id: number) => void;
  validateProductId: (product: Product | undefined, id: number) => void;
  validateProducts: (products: Product[]) => void;
}

export class ProductValidator implements IProductValidator {
  constructor() {}

  public validate(value: any, key: string): void {
    if (typeof value !== 'object' || value === null) {
      throw new Error(`${key} must be an object`);
    }
  }

  // ... other validation methods
}

// Add a toJSON method to the Product class for easier serialization
export class Product implements IProduct {
  id: number;
  name: string;
  description: string;
  carbonOffset: number;
  impactReport: string;

  constructor(product: IProduct) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.carbonOffset = product.carbonOffset;
    this.impactReport = product.impactReport;
  }

  toJSON(): IProduct {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      carbonOffset: this.carbonOffset,
      impactReport: this.impactReport,
    };
  }
}

export interface IProductValidatorMethods {
  validate: (value: any, key: string) => void;
  validateProduct: (product: IProduct) => void;
  validateUpdate: (updatedProduct: Partial<IProduct>) => void;
  validateUpdateProduct: (product: Product, updatedProduct: Partial<Product>) => void;
  validateId: (id: number) => void;
  validateDelete: (id: number) => void;
  validateProductId: (product: Product | undefined, id: number) => void;
  validateProducts: (products: Product[]) => void;
}

import { Product } from './product';
import { IProduct, IProductValidator, IProductCatalog, IProductValidatorMethods } from './interfaces';

export class ProductCatalog implements IProductCatalog {
  private products: Product[];
  private productValidator: ProductValidator;

  constructor(productValidator: ProductValidator) {
    this.products = [];
    this.productValidator = productValidator;
  }

  public addProduct(product: Product): void {
    this.productValidator.validateProduct(product);
    this.products.push(product);
  }

  public getProducts(): IProduct[] {
    return this.products.map((product) => product.toJSON());
  }

  public getProductById(id: number): Product | undefined {
    const product = this.products.find((product) => product.id === id);
    this.productValidator.validateProductId(product, id);
    return product;
  }

  public updateProduct(id: number, updatedProduct: Partial<Product>): void {
    const product = this.getProductById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    this.productValidator.validateUpdate(updatedProduct);
    this.productValidator.validateUpdateProduct(product, updatedProduct);
    Object.assign(product, updatedProduct);
  }

  public deleteProduct(id: number): void {
    const product = this.getProductById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    this.productValidator.validateDelete(id);
    this.products = this.products.filter((product) => product.id !== id);
  }
}

export interface IProduct {
  id: number;
  name: string;
  description: string;
  carbonOffset: number;
  impactReport: string;
}

export interface IProductValidator {
  validate: (value: any, key: string) => void;
  validateProduct: (product: IProduct) => void;
  validateUpdate: (updatedProduct: Partial<IProduct>) => void;
  validateUpdateProduct: (product: Product, updatedProduct: Partial<Product>) => void;
  validateId: (id: number) => void;
  validateDelete: (id: number) => void;
  validateProductId: (product: Product | undefined, id: number) => void;
  validateProducts: (products: Product[]) => void;
}

export class ProductValidator implements IProductValidator {
  constructor() {}

  public validate(value: any, key: string): void {
    if (typeof value !== 'object' || value === null) {
      throw new Error(`${key} must be an object`);
    }
  }

  // ... other validation methods
}

// Add a toJSON method to the Product class for easier serialization
export class Product implements IProduct {
  id: number;
  name: string;
  description: string;
  carbonOffset: number;
  impactReport: string;

  constructor(product: IProduct) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.carbonOffset = product.carbonOffset;
    this.impactReport = product.impactReport;
  }

  toJSON(): IProduct {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      carbonOffset: this.carbonOffset,
      impactReport: this.impactReport,
    };
  }
}

export interface IProductValidatorMethods {
  validate: (value: any, key: string) => void;
  validateProduct: (product: IProduct) => void;
  validateUpdate: (updatedProduct: Partial<IProduct>) => void;
  validateUpdateProduct: (product: Product, updatedProduct: Partial<Product>) => void;
  validateId: (id: number) => void;
  validateDelete: (id: number) => void;
  validateProductId: (product: Product | undefined, id: number) => void;
  validateProducts: (products: Product[]) => void;
}