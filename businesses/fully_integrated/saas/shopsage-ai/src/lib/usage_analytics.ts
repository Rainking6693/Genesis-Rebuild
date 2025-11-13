import React, { FC, useMemo } from 'react';

type Props = {
  title?: string;
};

const UsageAnalyticsMessage: FC<Props> = ({ title }) => {
  return (
    <div role="alert" aria-label="Usage Analytics message">
      <h1>{title}</h1>
    </div>
  );
};

const MemoizedUsageAnalytics: FC<Props> = (props) => {
  const { title } = props;

  const memoizedComponent = useMemo(() => {
    if (!title || title.trim() === '') return null;

    return (
      <div data-testid="usage-analytics" role="alert" aria-label="Usage Analytics message">
        <h1>{title}</h1>
      </div>
    );
  }, [title]);

  return memoizedComponent;
};

MemoizedUsageAnalytics.defaultProps = {
  title: 'Welcome to Usage Analytics',
};

UsageAnalytics.defaultProps = {
  title: 'Welcome to Usage Analytics',
};

export { UsageAnalyticsMessage, MemoizedUsageAnalytics };

In this updated code, I've added a type for the `title` prop, checked if the `title` prop is a non-empty string before rendering, and added a `data-testid` attribute for easier testing. I've also provided a default props object for both the `MemoizedUsageAnalytics` and `UsageAnalytics` components to ensure a default title is provided when no props are passed.