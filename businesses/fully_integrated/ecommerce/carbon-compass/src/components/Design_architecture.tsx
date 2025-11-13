import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';
import { PropsWithChildren } from 'react';

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

interface Props extends PropsWithChildren, DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  as?: JSX.IntrinsicElements[keyof JSX.IntrinsicElements] | 'p';
  variant?: Variant;
  accessibilityLabel?: string;
}

const supportedHTMLTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];

const CarbonCompassFunctionalComponent: FunctionComponent<Props> = ({
  message,
  as = 'p',
  variant = 'primary',
  className,
  style,
  accessibilityLabel,
  ...rest
}) => {
  const Component = as || 'p';

  if (!supportedHTMLTags.includes(Component as any)) {
    throw new Error(`Invalid HTML tag provided: ${as}. Supported tags are: ${supportedHTMLTags.join(', ')}.`);
  }

  const classes = `carbon-compass-message ${className} ${getVariantClass(variant)}`;

  return (
    <Component
      className={classes}
      style={style}
      {...rest}
      aria-label={accessibilityLabel}
    >
      {message}
    </Component>
  );
};

CarbonCompassFunctionalComponent.displayName = 'CarbonCompassFunctionalComponent';

const getVariantClass = (variant: Variant) => {
  switch (variant) {
    case 'primary':
      return 'text-primary';
    case 'secondary':
      return 'text-secondary';
    case 'success':
      return 'text-success';
    case 'danger':
      return 'text-danger';
    case 'warning':
      return 'text-warning';
    case 'info':
      return 'text-info';
    default:
      return '';
  }
};

export default CarbonCompassFunctionalComponent;

import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';
import { PropsWithChildren } from 'react';

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

interface Props extends PropsWithChildren, DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  as?: JSX.IntrinsicElements[keyof JSX.IntrinsicElements] | 'p';
  variant?: Variant;
  accessibilityLabel?: string;
}

const supportedHTMLTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];

const CarbonCompassFunctionalComponent: FunctionComponent<Props> = ({
  message,
  as = 'p',
  variant = 'primary',
  className,
  style,
  accessibilityLabel,
  ...rest
}) => {
  const Component = as || 'p';

  if (!supportedHTMLTags.includes(Component as any)) {
    throw new Error(`Invalid HTML tag provided: ${as}. Supported tags are: ${supportedHTMLTags.join(', ')}.`);
  }

  const classes = `carbon-compass-message ${className} ${getVariantClass(variant)}`;

  return (
    <Component
      className={classes}
      style={style}
      {...rest}
      aria-label={accessibilityLabel}
    >
      {message}
    </Component>
  );
};

CarbonCompassFunctionalComponent.displayName = 'CarbonCompassFunctionalComponent';

const getVariantClass = (variant: Variant) => {
  switch (variant) {
    case 'primary':
      return 'text-primary';
    case 'secondary':
      return 'text-secondary';
    case 'success':
      return 'text-success';
    case 'danger':
      return 'text-danger';
    case 'warning':
      return 'text-warning';
    case 'info':
      return 'text-info';
    default:
      return '';
  }
};

export default CarbonCompassFunctionalComponent;