import React, { forwardRef, useId, DetailedHTMLProps } from 'react';

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  as?: React.ElementType;
  ref?: React.Ref<HTMLDivElement>;
}

// Add a unique component name for better identification and maintenance
const RetentionLabContentComponent: React.ForwardRefRenderFunction<HTMLDivElement, Props> = (
  { message, as: Component = 'article', ref, ...htmlAttributes },
  refInstance
) => {
  const id = useId();

  // Use the provided element type or default to 'article'
  return (
    <Component id={id} ref={ref || refInstance} {...htmlAttributes} role="article">
      {message}
    </Component>
  );
};

// Export default with a descriptive name to align with the business context
export default forwardRef(RetentionLabContentComponent);

In this updated code, I've added the `DetailedHTMLProps` type to accept any valid HTML attributes for the `div` element. I've also added an `as` prop to allow the user to specify a custom HTML element type for the component. This can be useful for edge cases where a different element type is more appropriate. Additionally, I've added a default role of "article" to improve accessibility.