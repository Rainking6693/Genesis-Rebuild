import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';

type Props = DetailedHTMLProps<HTMLDivAttributes, HTMLDivElement> & {
  message: string;
  className?: string;
};

const EcoCreatorHubMessage: FunctionComponent<Props> = ({ className, message, ...rest }) => {
  return (
    <div className={`eco-creator-hub-message ${className}`} {...rest}>
      {message}
    </div>
  );
};

EcoCreatorHubMessage.defaultProps = {
  className: '',
};

export default EcoCreatorHubMessage;

import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';

type Props = DetailedHTMLProps<HTMLDivAttributes, HTMLDivElement> & {
  message: string;
  className?: string;
  role?: string;
  ariaLabel?: string;
};

const EcoCreatorHubMessage: FunctionComponent<Props> = ({ className, message, role, ariaLabel, ...rest }) => {
  return (
    <div className={`eco-creator-hub-message ${className}`} role={role} aria-label={ariaLabel} {...rest}>
      {message}
    </div>
  );
};

EcoCreatorHubMessage.defaultProps = {
  className: '',
  role: 'alert',
};

export default EcoCreatorHubMessage;

import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';

type Props = DetailedHTMLProps<HTMLDivAttributes, HTMLDivElement> & {
  message: string;
  className?: string;
};

const EcoCreatorHubMessage: FunctionComponent<Props> = ({ className, message, ...rest }) => {
  return (
    <div className={`eco-creator-hub-message ${className}`} {...rest}>
      {message}
    </div>
  );
};

EcoCreatorHubMessage.defaultProps = {
  className: '',
};

export default EcoCreatorHubMessage;

import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';

type Props = DetailedHTMLProps<HTMLDivAttributes, HTMLDivElement> & {
  message: string;
  className?: string;
  role?: string;
  ariaLabel?: string;
};

const EcoCreatorHubMessage: FunctionComponent<Props> = ({ className, message, role, ariaLabel, ...rest }) => {
  return (
    <div className={`eco-creator-hub-message ${className}`} role={role} aria-label={ariaLabel} {...rest}>
      {message}
    </div>
  );
};

EcoCreatorHubMessage.defaultProps = {
  className: '',
  role: 'alert',
};

export default EcoCreatorHubMessage;

Changes made:

1. Renamed `HTMLAttributes<HTMLDivElement>` to `HTMLDivAttributes` for better readability and consistency with other TypeScript projects.
2. Added a default value for the `className` prop to avoid potential issues when the prop is not provided.
3. Used `HTMLDivAttributes` instead of `HTMLAttributes<HTMLDivElement>` for the props object to make it clear that the component is a div.
4. Used `HTMLDivAttributes` instead of `HTMLAttributes<HTMLDivElement>` for the rest props to make it clear that the component is a div.
5. Used `DetailedHTMLProps<HTMLDivAttributes, HTMLDivElement>` for the props interface to make it clear that the component is a div and to include the common props like `id`, `tabIndex`, etc.
6. Used `HTMLDivAttributes` instead of `HTMLAttributes<HTMLDivElement>` for the rest props to make it clear that the component is a div.

Additionally, to improve accessibility, you may want to consider adding ARIA attributes like `role` and `aria-label` to the component. For example: