import React, { FC, PropsWithChildren } from 'react';

interface Props extends Omit<PropsWithChildren<any>, 'children'> {
  seoTitle?: string;
  seoDescription?: string;
  className?: string;
  ariaLabel?: string;
}

const FunctionalComponent: FC<Props> = ({
  seoTitle,
  seoDescription,
  className,
  ariaLabel,
  children,
}) => {
  const defaultAriaLabel = 'Content component';

  return (
    <div
      className={className}
      aria-label={ariaLabel || defaultAriaLabel}
    >
      {seoTitle && <title>{seoTitle}</title>}
      {seoDescription && <meta name="description" content={seoDescription} />}
      {children}
    </div>
  );
};

export default FunctionalComponent;

In this updated version, I've made the following changes:

1. Extended the `Props` interface to include `seoTitle`, `seoDescription`, `className`, and `ariaLabel` properties.
2. Imported `PropsWithChildren` from React to handle the children prop.
3. Used `Omit` to exclude the `children` prop from the `Props` interface.
4. Added support for `seoTitle` and `seoDescription` by including `<title>` and `<meta>` tags.
5. Added a default `aria-label` for accessibility purposes.
6. Included the `className` prop for styling flexibility.
7. Made the component more maintainable by using destructuring to access the props.
8. Ensured resiliency by handling edge cases where the `seoTitle`, `seoDescription`, or `ariaLabel` properties are not provided.
9. Improved the component's accessibility by including an `aria-label`.