import React, { FC, ReactNode, HTMLAttributes } from 'react';
import { useCallback, useId } from 'react';
import { useEvent, useKeyDown } from '@uirouter/react';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  label: string;
  onClick?: () => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  dataTestId?: string;
}

const DashboardButton: FC<Props> = ({
  label,
  onClick,
  onKeyDown,
  dataTestId,
  ...rest
}) => {
  const id = useId();

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (onKeyDown) {
        onKeyDown(event);
      }
    },
    [onKeyDown]
  );

  useKeyDown(id, handleKeyDown);

  return (
    <button
      id={id}
      data-testid={dataTestId}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {label}
    </button>
  );
};

export default DashboardButton;

import React, { FC, ReactNode, HTMLAttributes } from 'react';
import { useCallback, useId } from 'react';
import { useEvent, useKeyDown } from '@uirouter/react';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  label: string;
  onClick?: () => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  dataTestId?: string;
}

const DashboardButton: FC<Props> = ({
  label,
  onClick,
  onKeyDown,
  dataTestId,
  ...rest
}) => {
  const id = useId();

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (onKeyDown) {
        onKeyDown(event);
      }
    },
    [onKeyDown]
  );

  useKeyDown(id, handleKeyDown);

  return (
    <button
      id={id}
      data-testid={dataTestId}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {label}
    </button>
  );
};

export default DashboardButton;