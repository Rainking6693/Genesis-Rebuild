import React, { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';
import { EcoScoreAnalytics } from '../../../constants';

interface MyComponentProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, subtitle, description, className, ...rest }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
    }
  };

  return (
    <div
      className={className}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
      {description && <p>{description}</p>}
      <p>Powered by {EcoScoreAnalytics}</p>
    </div>
  );
};

MyComponent.defaultProps = {
  subtitle: '',
  description: '',
  className: '',
};

export default MyComponent;

Changes made:

1. Imported `DetailedHTMLProps` to extend the built-in `HTMLAttributes` for better maintainability and type safety.
2. Added an `onKeyDown` event handler to prevent the focus from moving out of the component when the Tab key is pressed, improving accessibility.
3. Spread the rest of the props to the div element to handle any unexpected props that might be passed to the component.
4. Removed the duplicate import and export default statements.