import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {
  name: string;
}

const ProductCatalog: FC<Props> = ({ className, id, name, ...rest }) => {
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  return (
    <h1 id={id} className={className} {...rest}>
      Hello, {formattedName}!
    </h1>
  );
};

export default ProductCatalog;

In this updated version:

1. I've extended the `Props` interface with `DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>` to handle additional HTML attributes like `className`, `id`, etc.

2. I've added an `id` property to the component for better accessibility and to make it easier to reference the component in other parts of the code.

3. I've created a `formattedName` variable to ensure that the first character of the `name` is always capitalized and the rest are lowercase.

4. I've used the spread operator `{...rest}` to pass through any additional attributes that might be provided to the component.

5. I've renamed the component from `FunctionalComponent` to `ProductCatalog` to better reflect its purpose.