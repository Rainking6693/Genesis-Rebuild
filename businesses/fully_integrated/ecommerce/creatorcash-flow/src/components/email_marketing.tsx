import React, { PropsWithChildren } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

interface Props extends PropsWithChildren {
  id: string;
  className?: string;
  tKey: string;
  fallbackMessage?: string;
}

const EmailMarketingComponent: React.FC<Props> = ({
  id,
  className,
  tKey,
  fallbackMessage = 'Email Marketing Component',
  children,
}) => {
  const { t } = useTranslation();

  return (
    <div id={id} className={classnames('email-marketing-component', className)}>
      {t(tKey) || fallbackMessage}
      {children}
    </div>
  );
};

EmailMarketingComponent.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  tKey: PropTypes.string.isRequired,
  fallbackMessage: PropTypes.string,
  children: PropTypes.node,
};

export default EmailMarketingComponent;

In this code:

- I've added an `id` prop for better accessibility and HTML structure.
- I've added a `className` prop for custom styling.
- I've used the `useTranslation` hook from `react-i18next` to support multiple languages.
- I've added a `fallbackMessage` prop to display a default message if the translation key is not found.
- I've used the `classnames` library to manage class names for better maintainability.
- I've added prop types for better type checking and maintainability.