import React, { memo, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

interface MyComponentProps {
  title: string;
  content: string;
  /** Optional callback function to execute when the component is clicked. Handles potential errors. */
  onClick?: () => void;
  /** Optional CSS class name for styling. */
  className?: string;
  /** Optional aria-label for accessibility. */
  ariaLabel?: string;
  /** Flag to indicate if the content should be rendered as HTML. Use with caution! */
  dangerouslySetInnerHTML?: boolean;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({
    title,
    content,
    onClick,
    className = '',
    ariaLabel,
    dangerouslySetInnerHTML = false,
  }) => {
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleClick = useCallback(() => {
      if (onClick) {
        try {
          onClick();
        } catch (error: any) {
          console.error('Error in onClick handler:', error);
          setErrorMessage(t('component.error.onClick', { message: error.message }));
        }
      }
    }, [onClick, t]);

    useEffect(() => {
      // Example: Simulate an error after a delay (for testing resiliency)
      // setTimeout(() => {
      //   setErrorMessage(t('component.error.simulated'));
      // }, 5000);
    }, [t]);

    const contentElement = dangerouslySetInnerHTML ? (
      <p
        data-testid="content"
        className="my-component__content"
        dangerouslySetInnerHTML={{ __html: content || '' }}
      />
    ) : (
      <p data-testid="content" className="my-component__content">
        {content || t('component.content.default')}
      </p>
    );

    return (
      <div
        data-testid="my-component"
        className={`my-component ${className}`}
        onClick={handleClick}
        aria-label={ariaLabel}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined} // Make the component focusable if clickable
      >
        <h1 data-testid="title" className="my-component__title">
          {title || t('component.title.default')}
        </h1>
        {contentElement}

        {errorMessage && (
          <div data-testid="error-message" className="my-component__error">
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

MyComponent.displayName = 'MyComponent';

MyComponent.defaultProps = {
  className: '',
  dangerouslySetInnerHTML: false,
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  dangerouslySetInnerHTML: PropTypes.bool,
};

export default MyComponent;

import React, { memo, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

interface MyComponentProps {
  title: string;
  content: string;
  /** Optional callback function to execute when the component is clicked. Handles potential errors. */
  onClick?: () => void;
  /** Optional CSS class name for styling. */
  className?: string;
  /** Optional aria-label for accessibility. */
  ariaLabel?: string;
  /** Flag to indicate if the content should be rendered as HTML. Use with caution! */
  dangerouslySetInnerHTML?: boolean;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({
    title,
    content,
    onClick,
    className = '',
    ariaLabel,
    dangerouslySetInnerHTML = false,
  }) => {
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleClick = useCallback(() => {
      if (onClick) {
        try {
          onClick();
        } catch (error: any) {
          console.error('Error in onClick handler:', error);
          setErrorMessage(t('component.error.onClick', { message: error.message }));
        }
      }
    }, [onClick, t]);

    useEffect(() => {
      // Example: Simulate an error after a delay (for testing resiliency)
      // setTimeout(() => {
      //   setErrorMessage(t('component.error.simulated'));
      // }, 5000);
    }, [t]);

    const contentElement = dangerouslySetInnerHTML ? (
      <p
        data-testid="content"
        className="my-component__content"
        dangerouslySetInnerHTML={{ __html: content || '' }}
      />
    ) : (
      <p data-testid="content" className="my-component__content">
        {content || t('component.content.default')}
      </p>
    );

    return (
      <div
        data-testid="my-component"
        className={`my-component ${className}`}
        onClick={handleClick}
        aria-label={ariaLabel}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined} // Make the component focusable if clickable
      >
        <h1 data-testid="title" className="my-component__title">
          {title || t('component.title.default')}
        </h1>
        {contentElement}

        {errorMessage && (
          <div data-testid="error-message" className="my-component__error">
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

MyComponent.displayName = 'MyComponent';

MyComponent.defaultProps = {
  className: '',
  dangerouslySetInnerHTML: false,
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  dangerouslySetInnerHTML: PropTypes.bool,
};

export default MyComponent;