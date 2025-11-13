import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react';

interface Props {
  name?: string;
  variant?: string;
}

const defaultName = 'Visitor';
const defaultVariant = 'control';

const MyComponent: FunctionComponent<Props> = ({ name = defaultName, variant = defaultVariant }: Props) => {
  const [displayName, setDisplayName] = useState(defaultName);

  useEffect(() => {
    if (name) {
      setDisplayName(name);
    }
  }, [name]);

  if (!displayName || displayName.trim() === '') {
    console.warn('Name is required');
    setDisplayName(defaultName);
  }

  return (
    <h1 role="heading" aria-level={1}>
      Hello, {displayName}! (Variant: {variant})
    </h1>
  );
};

const MemoizedMyComponent = React.memo(MyComponent);

export default MemoizedMyComponent;

import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react';

interface Props {
  name?: string;
  variant?: string;
}

const defaultName = 'Visitor';
const defaultVariant = 'control';

const MyComponent: FunctionComponent<Props> = ({ name = defaultName, variant = defaultVariant }: Props) => {
  const [displayName, setDisplayName] = useState(defaultName);

  useEffect(() => {
    if (name) {
      setDisplayName(name);
    }
  }, [name]);

  if (!displayName || displayName.trim() === '') {
    console.warn('Name is required');
    setDisplayName(defaultName);
  }

  return (
    <h1 role="heading" aria-level={1}>
      Hello, {displayName}! (Variant: {variant})
    </h1>
  );
};

const MemoizedMyComponent = React.memo(MyComponent);

export default MemoizedMyComponent;