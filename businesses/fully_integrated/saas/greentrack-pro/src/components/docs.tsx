import React, { FC, ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  description: string;
  className?: string;
  children?: ReactNode;
  /** Additional role for the container to improve accessibility */
  containerRole?: 'region' | 'article' | 'section';
}

const MyComponent: FC<Props> = ({ title, subtitle = '', description, className, children, containerRole = 'section' }) => {
  return (
    <> {/* Using React.Fragment for better encapsulation */}
      <div role={containerRole} className={className}>
        <h2>{title}</h2>
        {subtitle && <p role="presentation">{subtitle}</p>}
        <p>{description}</p>
        {children}
      </div>
    </>
  );
};

export default MyComponent;

In this updated version, I've added a `containerRole` prop to allow users to specify the ARIA role for the container. This can help improve the accessibility of the component when it's used in different contexts. I've also added some TypeScript type improvements, such as specifying default values for the `subtitle` prop and adding a type for the `children` prop.