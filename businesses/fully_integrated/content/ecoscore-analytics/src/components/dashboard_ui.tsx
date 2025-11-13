import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
import { classnames } from 'classnames';
import { useId } from '@react-aria/utils';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  dataTestId?: string;
  ariaLabel?: string;
}

const Button: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { label, onClick, disabled, className, dataTestId, ariaLabel },
  ref,
) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (buttonRef.current) {
        buttonRef.current.focus();
      }
    },
  }));

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      ref={buttonRef}
      className={classnames('btn', className)}
      onClick={handleClick}
      disabled={disabled}
      data-testid={dataTestId}
      aria-label={ariaLabel || label}
      aria-disabled={disabled ? 'true' : undefined}
      role="button"
      id={id}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  dataTestId: PropTypes.string,
  ariaLabel: PropTypes.string,
};

Button.defaultProps = {
  disabled: false,
  className: '',
  dataTestId: '',
  ariaLabel: undefined,
};

export default forwardRef(Button);

In this updated code, I've added the `aria-label`, `aria-disabled`, and `role` attributes for accessibility, handled missing `onClick` prop, and used `forwardRef` for testing purposes. I've also added the `useId` hook to generate unique `id` attributes for each button instance. Additionally, I've updated the `ButtonProps` interface to include the `ariaLabel` prop.