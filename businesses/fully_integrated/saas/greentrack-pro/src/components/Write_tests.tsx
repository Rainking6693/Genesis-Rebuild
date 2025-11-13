import React, { useState, ReactNode, KeyboardEvent } from 'react';
import { useId } from '@react-aria/utils';
import { useFocusRing, FocusRing, FocusRingProps } from '@react-aria/focus';

type Variant = 'success' | 'warning' | 'error' | 'info';
type Size = 'small' | 'large';

interface Props {
  message: string;
  variant?: Variant;
  size?: Size;
  id?: string;
}

const allowedVariants: Variant[] = ['success', 'warning', 'error', 'info'];
const allowedSizes: Size[] = ['small', 'large'];

const MyComponent: React.FC<Props> = ({ message, variant = 'info', size = 'small', id }) => {
  const componentId = id || useId();
  const { focusProps, ref } = useFocusRing();

  const getMessageClassName = (): string => {
    let className = `my-component-message`;
    if (size) className += ` ${size}`;
    if (variant) className += ` ${variant}`;
    return className;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      ref?.current?.blur();
    }
  };

  return (
    <div data-testid="my-component" role="alert" aria-live="polite" aria-describedby={componentId}>
      <div id={componentId} className={`my-component ${size}`}>
        <div
          data-testid="my-component-message"
          className={getMessageClassName()}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-labelledby={componentId}
        >
          {message}
        </div>
        <FocusRing {...focusProps} />
      </div>
    </div>
  );
};

export default MyComponent;

import React, { useState, ReactNode, KeyboardEvent } from 'react';
import { useId } from '@react-aria/utils';
import { useFocusRing, FocusRing, FocusRingProps } from '@react-aria/focus';

type Variant = 'success' | 'warning' | 'error' | 'info';
type Size = 'small' | 'large';

interface Props {
  message: string;
  variant?: Variant;
  size?: Size;
  id?: string;
}

const allowedVariants: Variant[] = ['success', 'warning', 'error', 'info'];
const allowedSizes: Size[] = ['small', 'large'];

const MyComponent: React.FC<Props> = ({ message, variant = 'info', size = 'small', id }) => {
  const componentId = id || useId();
  const { focusProps, ref } = useFocusRing();

  const getMessageClassName = (): string => {
    let className = `my-component-message`;
    if (size) className += ` ${size}`;
    if (variant) className += ` ${variant}`;
    return className;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      ref?.current?.blur();
    }
  };

  return (
    <div data-testid="my-component" role="alert" aria-live="polite" aria-describedby={componentId}>
      <div id={componentId} className={`my-component ${size}`}>
        <div
          data-testid="my-component-message"
          className={getMessageClassName()}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-labelledby={componentId}
        >
          {message}
        </div>
        <FocusRing {...focusProps} />
      </div>
    </div>
  );
};

export default MyComponent;