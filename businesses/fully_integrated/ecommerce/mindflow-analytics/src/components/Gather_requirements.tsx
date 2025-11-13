import React, { memo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { logError } from './utils/error-logging';
import { useAccessibleFriendlyStyles } from './hooks/useAccessibleFriendlyStyles';

interface MyComponentProps {
  title: string;
  content: string;
  onContentClick?: (content: string) => void;
  componentId?: string;
  isLoading?: boolean;
  errorMessage?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, onContentClick, componentId, isLoading, errorMessage }) => {
    const { t } = useTranslation();
    const [internalState, setInternalState] = useState<string>('');
    const accessibleStyles = useAccessibleFriendlyStyles();

    const uniqueId = componentId || `my-component-${Math.random().toString(36).substring(2, 15)}`;

    useEffect(() => {
      const fetchData = async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          setInternalState('Data loaded successfully');
        } catch (error: any) {
          logError(`Error fetching data in MyComponent (${uniqueId}):`, error);
        }
      };

      if (isLoading) {
        fetchData();
      }
    }, [isLoading, uniqueId]);

    const handleClick = useCallback(() => {
      if (onContentClick) {
        try {
          onContentClick(content);
        } catch (error: any) {
          logError(`Error in onContentClick callback in MyComponent (${uniqueId}):`, error);
        }
      } else {
        console.warn(`onContentClick is not defined for MyComponent (${uniqueId})`);
      }
    }, [content, onContentClick, uniqueId]);

    if (isLoading) {
      return <div data-testid={`${uniqueId}-loading`}>{t('Loading...')}</div>;
    }

    if (errorMessage) {
      return (
        <div data-testid={`${uniqueId}-error`} style={{ color: 'red' }}>
          {t('Error:')} {errorMessage}
        </div>
      );
    }

    return (
      <div data-testid={uniqueId} className={accessibleStyles.container}>
        <h1 data-testid={`${uniqueId}-title`} className={accessibleStyles.heading}>
          {title || t('No Title')}
        </h1>
        <p
          data-testid={`${uniqueId}-content`}
          onClick={handleClick}
          style={{ cursor: onContentClick ? 'pointer' : 'default' }}
          className={accessibleStyles.paragraph}
        >
          {content || t('No Content')}
        </p>
        {internalState && <div data-testid={`${uniqueId}-internal-state`}>{internalState}</div>}
      </div>
    );
  }
);

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onContentClick: PropTypes.func,
  componentId: PropTypes.string,
  isLoading: PropTypes.bool,
  errorMessage: PropTypes.string,
};

MyComponent.defaultProps = {
  componentId: undefined,
  isLoading: false,
  errorMessage: undefined,
  onContentClick: undefined,
};

export default MyComponent;

import React, { memo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { logError } from './utils/error-logging';
import { useAccessibleFriendlyStyles } from './hooks/useAccessibleFriendlyStyles';

interface MyComponentProps {
  title: string;
  content: string;
  onContentClick?: (content: string) => void;
  componentId?: string;
  isLoading?: boolean;
  errorMessage?: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(
  ({ title, content, onContentClick, componentId, isLoading, errorMessage }) => {
    const { t } = useTranslation();
    const [internalState, setInternalState] = useState<string>('');
    const accessibleStyles = useAccessibleFriendlyStyles();

    const uniqueId = componentId || `my-component-${Math.random().toString(36).substring(2, 15)}`;

    useEffect(() => {
      const fetchData = async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          setInternalState('Data loaded successfully');
        } catch (error: any) {
          logError(`Error fetching data in MyComponent (${uniqueId}):`, error);
        }
      };

      if (isLoading) {
        fetchData();
      }
    }, [isLoading, uniqueId]);

    const handleClick = useCallback(() => {
      if (onContentClick) {
        try {
          onContentClick(content);
        } catch (error: any) {
          logError(`Error in onContentClick callback in MyComponent (${uniqueId}):`, error);
        }
      } else {
        console.warn(`onContentClick is not defined for MyComponent (${uniqueId})`);
      }
    }, [content, onContentClick, uniqueId]);

    if (isLoading) {
      return <div data-testid={`${uniqueId}-loading`}>{t('Loading...')}</div>;
    }

    if (errorMessage) {
      return (
        <div data-testid={`${uniqueId}-error`} style={{ color: 'red' }}>
          {t('Error:')} {errorMessage}
        </div>
      );
    }

    return (
      <div data-testid={uniqueId} className={accessibleStyles.container}>
        <h1 data-testid={`${uniqueId}-title`} className={accessibleStyles.heading}>
          {title || t('No Title')}
        </h1>
        <p
          data-testid={`${uniqueId}-content`}
          onClick={handleClick}
          style={{ cursor: onContentClick ? 'pointer' : 'default' }}
          className={accessibleStyles.paragraph}
        >
          {content || t('No Content')}
        </p>
        {internalState && <div data-testid={`${uniqueId}-internal-state`}>{internalState}</div>}
      </div>
    );
  }
);

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onContentClick: PropTypes.func,
  componentId: PropTypes.string,
  isLoading: PropTypes.bool,
  errorMessage: PropTypes.string,
};

MyComponent.defaultProps = {
  componentId: undefined,
  isLoading: false,
  errorMessage: undefined,
  onContentClick: undefined,
};

export default MyComponent;