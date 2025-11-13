import React, { useEffect, useState, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  name?: string;
}

const MyComponent: React.FC<Props> = ({ className, children, name, ...rest }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!name) {
      setError('Name prop is required');
    } else if (typeof name !== 'string') {
      setError('Name prop must be a string');
    }
  }, [name]);

  if (error) {
    return (
      <div className={`error-message ${className}`} {...rest}>
        {error}
      </div>
    );
  }

  return <h1 className={`brand-font ${className}`} {...rest}>Welcome, {name || 'Guest'}!</h1>;
};

MyComponent.defaultProps = {
  className: '',
  name: 'Guest' // Provide a default value for name prop
};

export default MyComponent;

import React, { useEffect, useState, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  name?: string;
}

const MyComponent: React.FC<Props> = ({ className, children, name, ...rest }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!name) {
      setError('Name prop is required');
    } else if (typeof name !== 'string') {
      setError('Name prop must be a string');
    }
  }, [name]);

  if (error) {
    return (
      <div className={`error-message ${className}`} {...rest}>
        {error}
      </div>
    );
  }

  return <h1 className={`brand-font ${className}`} {...rest}>Welcome, {name || 'Guest'}!</h1>;
};

MyComponent.defaultProps = {
  className: '',
  name: 'Guest' // Provide a default value for name prop
};

export default MyComponent;