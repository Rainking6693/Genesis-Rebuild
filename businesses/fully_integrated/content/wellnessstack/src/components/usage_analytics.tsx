import React, { useEffect, useState } from 'react';

interface PropsType {
  message: string;
  analytics?: {
    logUsageAnalytics: (message: string, error?: ErrorObjectType) => void;
  };
}

interface DefaultPropsType {
  message?: string;
  analytics?: {
    logUsageAnalytics: (message: string, error?: ErrorObjectType) => void;
  };
}

interface ErrorObjectType {
  message: string;
}

interface LogUsageAnalyticsType extends ErrorObjectType {
  (message: string, error?: ErrorObjectType): void;
}

const defaultLogUsageAnalytics: LogUsageAnalyticsType = (message, error) => {
  console.error(`Usage analytics could not be logged: ${message}`, error);
};

const FunctionalComponentType: React.FC<PropsType> = ({
  message,
  analytics = {},
}: PropsType) => {
  const [stateAnalytics, setStateAnalytics] = useState<AnalyticsType>({
    logUsageAnalytics: defaultLogUsageAnalytics,
  });

  const [stateMessage, setStateMessage] = useState<string>(message);

  useEffect(() => {
    if (!analytics.logUsageAnalytics || !stateMessage) {
      console.warn(
        'Either logUsageAnalytics function or message property not provided. Usage analytics will not be logged.'
      );
      return;
    }

    analytics.logUsageAnalytics(stateMessage);
  }, [stateMessage, analytics.logUsageAnalytics]);

  return <div>{stateMessage}</div>;
};

FunctionalComponentType.defaultProps = {
  defaultProps: {
    message: '',
    analytics: {
      logUsageAnalytics: defaultLogUsageAnalytics,
    },
  },
} as DefaultPropsType;

export default FunctionalComponentType;

import React, { useEffect, useState } from 'react';

interface PropsType {
  message: string;
  analytics?: {
    logUsageAnalytics: (message: string, error?: ErrorObjectType) => void;
  };
}

interface DefaultPropsType {
  message?: string;
  analytics?: {
    logUsageAnalytics: (message: string, error?: ErrorObjectType) => void;
  };
}

interface ErrorObjectType {
  message: string;
}

interface LogUsageAnalyticsType extends ErrorObjectType {
  (message: string, error?: ErrorObjectType): void;
}

const defaultLogUsageAnalytics: LogUsageAnalyticsType = (message, error) => {
  console.error(`Usage analytics could not be logged: ${message}`, error);
};

const FunctionalComponentType: React.FC<PropsType> = ({
  message,
  analytics = {},
}: PropsType) => {
  const [stateAnalytics, setStateAnalytics] = useState<AnalyticsType>({
    logUsageAnalytics: defaultLogUsageAnalytics,
  });

  const [stateMessage, setStateMessage] = useState<string>(message);

  useEffect(() => {
    if (!analytics.logUsageAnalytics || !stateMessage) {
      console.warn(
        'Either logUsageAnalytics function or message property not provided. Usage analytics will not be logged.'
      );
      return;
    }

    analytics.logUsageAnalytics(stateMessage);
  }, [stateMessage, analytics.logUsageAnalytics]);

  return <div>{stateMessage}</div>;
};

FunctionalComponentType.defaultProps = {
  defaultProps: {
    message: '',
    analytics: {
      logUsageAnalytics: defaultLogUsageAnalytics,
    },
  },
} as DefaultPropsType;

export default FunctionalComponentType;