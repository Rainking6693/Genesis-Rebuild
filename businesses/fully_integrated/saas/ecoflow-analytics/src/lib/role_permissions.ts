import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface BaseProps {
  /**
   * The unique identifier for the permission message.
   */
  id: string;
}

interface PermissionMessageProps extends BaseProps {
  /**
   * The message to be displayed.
   */
  message: string;

  /**
   * Additional attributes for the div element.
   */
  attributes?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}

/**
 * A reusable permission message component.
 */
const PermissionMessage: React.FC<PermissionMessageProps> = ({ id, message, attributes }) => {
  const combinedAttributes = { ...attributes, role: 'alert', aria: { live: 'polite' } };

  return (
    <div id={id} {...combinedAttributes}>
      {message}
    </div>
  );
};

export { PermissionMessage };

import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface BaseProps {
  /**
   * The unique identifier for the permission message.
   */
  id: string;
}

interface PermissionMessageProps extends BaseProps {
  /**
   * The message to be displayed.
   */
  message: string;

  /**
   * Additional attributes for the div element.
   */
  attributes?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}

/**
 * A reusable permission message component.
 */
const PermissionMessage: React.FC<PermissionMessageProps> = ({ id, message, attributes }) => {
  const combinedAttributes = { ...attributes, role: 'alert', aria: { live: 'polite' } };

  return (
    <div id={id} {...combinedAttributes}>
      {message}
    </div>
  );
};

export { PermissionMessage };