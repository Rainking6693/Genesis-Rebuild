import React, { FC, ReactNode, MouseEvent, KeyboardEvent } from 'react';

interface Props {
  message: string;
  children?: ReactNode;
  handleClick?: (event: MouseEvent<HTMLDivElement>) => void;
  ariaLabel?: string;
}

const MyComponent: FC<Props> = ({ message, children, handleClick, ariaLabel }) => {
  const handleClickEvent = (event: MouseEvent<HTMLDivElement>) => {
    if (handleClick) {
      handleClick(event);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClickEvent(event);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={ariaLabel || 'Click or press Enter to interact'}
      onClick={handleClickEvent}
      onKeyDown={handleKeyDown}
    >
      {message}
      {children}
    </div>
  );
};

MyComponent.defaultProps = {
  message: 'No message provided',
  ariaLabel: 'Click or press Enter to interact',
};

export default MyComponent;

import React, { FC, ReactNode, MouseEvent, KeyboardEvent } from 'react';

interface Props {
  message: string;
  children?: ReactNode;
  handleClick?: (event: MouseEvent<HTMLDivElement>) => void;
  ariaLabel?: string;
}

const MyComponent: FC<Props> = ({ message, children, handleClick, ariaLabel }) => {
  const handleClickEvent = (event: MouseEvent<HTMLDivElement>) => {
    if (handleClick) {
      handleClick(event);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClickEvent(event);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={ariaLabel || 'Click or press Enter to interact'}
      onClick={handleClickEvent}
      onKeyDown={handleKeyDown}
    >
      {message}
      {children}
    </div>
  );
};

MyComponent.defaultProps = {
  message: 'No message provided',
  ariaLabel: 'Click or press Enter to interact',
};

export default MyComponent;