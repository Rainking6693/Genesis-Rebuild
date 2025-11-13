import React, { forwardRef, useCallback, useId, useMemo } from 'react';
import PropTypes from 'prop-types';

const Button = forwardRef((props, ref) => {
  const {
    label,
    onClick,
    disabled,
    className,
    ariaLabel,
    role,
    tabIndex,
    loading,
    size,
    type,
    children,
    icon,
    iconPosition,
    loadingText,
    loadingSpinner,
    disabledStyles,
    ...rest
  } = props;

  const id = useId();

  const handleClick = useCallback((event) => {
    if (!loading && !disabled) {
      onClick(event);
    }
  }, [loading, disabled, onClick]);

  const buttonClasses = useMemo(
    () => `btn ${className} ${size} ${loading ? 'loading' : ''} ${disabled ? 'disabled' : ''} ${iconPosition}`,
    [className, size, loading, disabled, iconPosition]
  );

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      role={role}
      tabIndex={tabIndex}
      data-testid="button"
      id={id}
      style={disabled ? disabledStyles : undefined}
      {...rest}
    >
      {loadingSpinner || (
        <>
          {icon && <span className="icon">{icon}</span>}
          {children}
          {loadingText && <span className="loading-text">{loadingText}</span>}
        </>
      )}
    </button>
  );
});

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
  tabIndex: PropTypes.number,
  loading: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['start', 'end']),
  loadingText: PropTypes.string,
  loadingSpinner: PropTypes.node,
  disabledStyles: PropTypes.object,
};

Button.defaultProps = {
  disabled: false,
  className: '',
  ariaLabel: '',
  role: 'button',
  tabIndex: 0,
  loading: false,
  size: 'medium',
  type: 'button',
  disabledStyles: {},
};

export default Button;

import React from 'react';
import Button from './Button';

const PrimaryButton = forwardRef((props, ref) => {
  return (
    <Button
      {...props}
      primary
      testId="primary-button"
      className="btn-primary"
      aria-label="Primary action button"
      ref={ref}
    />
  );
});

PrimaryButton.propTypes = Button.propTypes;
PrimaryButton.defaultProps = Button.defaultProps;
PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;

import React from 'react';
import Button from './Button';

const SecondaryButton = forwardRef((props, ref) => {
  return (
    <Button
      {...props}
      primary={false}
      testId="secondary-button"
      className="btn-secondary"
      aria-label="Secondary action button"
      ref={ref}
    />
  );
});

SecondaryButton.propTypes = Button.propTypes;
SecondaryButton.defaultProps = Button.defaultProps;
SecondaryButton.displayName = 'SecondaryButton';

export default SecondaryButton;

This updated code provides a more flexible and customizable Button component, with better resiliency, edge cases, accessibility, and maintainability.