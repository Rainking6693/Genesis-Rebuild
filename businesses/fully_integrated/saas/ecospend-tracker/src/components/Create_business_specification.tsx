import React, { FC, useMemo, ReactElement } from 'react';
import PropTypes from 'prop-types';

type Props = React.ComponentPropsWithoutRef<"div"> & {
  message?: string;
  className?: string;
};

const MyComponent: FC<Props> = ({ message = 'Welcome to EcoSpend Tracker', className, ...rest }) => {
  const MemoizedComponent = useMemo<ReactElement<any>>(() => <div className={className}>{message}</div>, [message, className]);
  return MemoizedComponent;
};

MyComponent.defaultProps = {
  message: 'Welcome to EcoSpend Tracker',
  className: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
};

// Ensure consistent naming convention
const EcoSpendTrackerComponent: React.ComponentType<any> = MyComponent;

export default EcoSpendTrackerComponent;

This updated code provides better type safety, improved readability, and more robust handling of edge cases. Additionally, it follows best practices for TypeScript and React component development.