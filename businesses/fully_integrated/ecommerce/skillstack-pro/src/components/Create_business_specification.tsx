import React, { FC, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withErrorBoundary } from 'react-error-boundary';
import { memo } from 'react';
import { useLocale } from './locale';

interface Props {
  id: string;
  messageKey: string;
}

const MyComponent: FC<Props> = ({ id, messageKey }) => {
  const { t } = useLocale();
  const [error, setError] = useState(null);
  const message = useMemo(() => t(messageKey), [messageKey, t]);

  if (error) {
    return <div>An error occurred: {error}</div>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: message }}
      aria-label={t(messageKey)} // Use the same key for aria-label for consistency
      aria-labelledby={id} // Provide an ID for aria-labelledby to improve accessibility
    />
  );
};

MyComponent.defaultProps = {
  id: '',
  messageKey: '',
};

MyComponent.propTypes = {
  id: PropTypes.string,
  messageKey: PropTypes.string.isRequired,
};

const withErrorBoundary = Comp => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    componentDidCatch(error, info) {
      this.setState({ hasError: true, error });
    }

    render() {
      if (this.state.hasError) {
        return <Comp {...this.props} error={this.state.error} />;
      }

      return <Comp {...this.props} />;
    }
  };
};

const withMemo = Comp => {
  return memo(Comp);
};

const MyComponentWithMemoAndErrorBoundary = compose(
  withErrorBoundary,
  withMemo
)(MyComponent);

export default MyComponentWithMemoAndErrorBoundary;

import React, { FC, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withErrorBoundary } from 'react-error-boundary';
import { memo } from 'react';
import { useLocale } from './locale';

interface Props {
  id: string;
  messageKey: string;
}

const MyComponent: FC<Props> = ({ id, messageKey }) => {
  const { t } = useLocale();
  const [error, setError] = useState(null);
  const message = useMemo(() => t(messageKey), [messageKey, t]);

  if (error) {
    return <div>An error occurred: {error}</div>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: message }}
      aria-label={t(messageKey)} // Use the same key for aria-label for consistency
      aria-labelledby={id} // Provide an ID for aria-labelledby to improve accessibility
    />
  );
};

MyComponent.defaultProps = {
  id: '',
  messageKey: '',
};

MyComponent.propTypes = {
  id: PropTypes.string,
  messageKey: PropTypes.string.isRequired,
};

const withErrorBoundary = Comp => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    componentDidCatch(error, info) {
      this.setState({ hasError: true, error });
    }

    render() {
      if (this.state.hasError) {
        return <Comp {...this.props} error={this.state.error} />;
      }

      return <Comp {...this.props} />;
    }
  };
};

const withMemo = Comp => {
  return memo(Comp);
};

const MyComponentWithMemoAndErrorBoundary = compose(
  withErrorBoundary,
  withMemo
)(MyComponent);

export default MyComponentWithMemoAndErrorBoundary;