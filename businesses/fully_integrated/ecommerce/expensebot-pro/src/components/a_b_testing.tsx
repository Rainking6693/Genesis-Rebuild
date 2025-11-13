import React, { FunctionComponent, ReactNode, DetailedHTMLProps } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface BaseProps {
  /** The message to be displayed */
  message: string;
}

interface CleanedHTMLProps extends BaseProps {
  /** The sanitized HTML string to be set as innerHTML */
  dangerouslySetInnerHTML: DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}

interface AccessibilityProps {
  /** ARIA label for the component */
  ariaLabel?: string;
  /** ARIA role for the component */
  ariaRole?: string;
}

type Props = BaseProps & AccessibilityProps;

const MyComponent: FunctionComponent<Props> = ({ message, ariaLabel, ariaRole, dangerouslySetInnerHTML }: Props) => {
  const cleanedHTML = DOMPurify.sanitize(message);

  const safeHTML: ReactNode = (
    <div
      {...dangerouslySetInnerHTML}
      aria-label={ariaLabel}
      role={ariaRole}
    />
  );

  return safeHTML;
};

MyComponent.defaultProps = {
  message: '',
  ariaLabel: 'A/B testing component',
  ariaRole: 'presentation',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string,
  ariaRole: PropTypes.string,
};

export default MyComponent;

import React, { FunctionComponent, ReactNode, DetailedHTMLProps } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface BaseProps {
  /** The message to be displayed */
  message: string;
}

interface CleanedHTMLProps extends BaseProps {
  /** The sanitized HTML string to be set as innerHTML */
  dangerouslySetInnerHTML: DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}

interface AccessibilityProps {
  /** ARIA label for the component */
  ariaLabel?: string;
  /** ARIA role for the component */
  ariaRole?: string;
}

type Props = BaseProps & AccessibilityProps;

const MyComponent: FunctionComponent<Props> = ({ message, ariaLabel, ariaRole, dangerouslySetInnerHTML }: Props) => {
  const cleanedHTML = DOMPurify.sanitize(message);

  const safeHTML: ReactNode = (
    <div
      {...dangerouslySetInnerHTML}
      aria-label={ariaLabel}
      role={ariaRole}
    />
  );

  return safeHTML;
};

MyComponent.defaultProps = {
  message: '',
  ariaLabel: 'A/B testing component',
  ariaRole: 'presentation',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string,
  ariaRole: PropTypes.string,
};

export default MyComponent;