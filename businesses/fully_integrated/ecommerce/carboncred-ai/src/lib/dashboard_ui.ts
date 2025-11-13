type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
};

type RenderOptions = {
  className?: string;
  ariaLabel?: string;
};

function renderProductCard(product: Product, options: RenderOptions = {}): JSX.Element {
  const { className, ariaLabel } = options;

  // Edge case: Check if product data is valid
  if (!product.id || !product.name || !product.price || !product.imageUrl || !product.description) {
    throw new Error('Invalid product data');
  }

  // Accessibility: Provide an aria-label for screen readers
  const productAriaLabel = ariaLabel || `Product ${product.name}`;

  // Maintainability: Use a constant for the base class name
  const baseClassName = 'product-card';

  // Resiliency: Use optional chaining to avoid errors when accessing undefined properties
  const productImage = product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : null;

  return (
    <div className={`${baseClassName} ${className}`} aria-label={productAriaLabel}>
      <h2>{product.name}</h2>
      <p>{product.price}</p>
      {productImage}
      <p>{product.description}</p>
    </div>
  );
}

const myProduct: Product = {
  id: 1,
  name: 'My Product',
  price: 9.99,
  imageUrl: 'https://example.com/product-image.jpg',
  description: 'This is my product description.',
};

const customClassName = 'custom-product-card';

const productCard = renderProductCard(myProduct, { className: customClassName });

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
};

type RenderOptions = {
  className?: string;
  ariaLabel?: string;
};

function renderProductCard(product: Product, options: RenderOptions = {}): JSX.Element {
  const { className, ariaLabel } = options;

  // Edge case: Check if product data is valid
  if (!product.id || !product.name || !product.price || !product.imageUrl || !product.description) {
    throw new Error('Invalid product data');
  }

  // Accessibility: Provide an aria-label for screen readers
  const productAriaLabel = ariaLabel || `Product ${product.name}`;

  // Maintainability: Use a constant for the base class name
  const baseClassName = 'product-card';

  // Resiliency: Use optional chaining to avoid errors when accessing undefined properties
  const productImage = product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : null;

  return (
    <div className={`${baseClassName} ${className}`} aria-label={productAriaLabel}>
      <h2>{product.name}</h2>
      <p>{product.price}</p>
      {productImage}
      <p>{product.description}</p>
    </div>
  );
}

const myProduct: Product = {
  id: 1,
  name: 'My Product',
  price: 9.99,
  imageUrl: 'https://example.com/product-image.jpg',
  description: 'This is my product description.',
};

const customClassName = 'custom-product-card';

const productCard = renderProductCard(myProduct, { className: customClassName });

You can call this function like this: