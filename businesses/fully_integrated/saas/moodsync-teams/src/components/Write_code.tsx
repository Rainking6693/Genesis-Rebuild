import React, { FC, ReactNode } from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { sanitize } from './sanitize';
import { css } from 'emotion';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = createReactClass({
  displayName: 'MyComponent',

  propTypes: {
    message: PropTypes.string.isRequired,
  },

  getDefaultProps() {
    return {
      message: 'No message provided',
    };
  },

  getInitialState() {
    return {
      safeMessage: this.props.message,
    };
  },

  componentDidMount() {
    this.setState({ safeMessage: sanitize(this.props.message) });
  },

  componentDidUpdate(prevProps: Props) {
    if (this.props.message !== prevProps.message) {
      this.setState({ safeMessage: sanitize(this.props.message) });
    }
  },

  render() {
    const { safeMessage } = this.state;

    return (
      <div className={styles.container} role="alert">
        <div dangerouslySetInnerHTML={{ __html: safeMessage }} />
      </div>
    );
  },
});

const styles = {
  container: css`
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  `,
};

export default MyComponent;

import React, { FC, ReactNode } from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { sanitize } from './sanitize';
import { css } from 'emotion';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = createReactClass({
  displayName: 'MyComponent',

  propTypes: {
    message: PropTypes.string.isRequired,
  },

  getDefaultProps() {
    return {
      message: 'No message provided',
    };
  },

  getInitialState() {
    return {
      safeMessage: this.props.message,
    };
  },

  componentDidMount() {
    this.setState({ safeMessage: sanitize(this.props.message) });
  },

  componentDidUpdate(prevProps: Props) {
    if (this.props.message !== prevProps.message) {
      this.setState({ safeMessage: sanitize(this.props.message) });
    }
  },

  render() {
    const { safeMessage } = this.state;

    return (
      <div className={styles.container} role="alert">
        <div dangerouslySetInnerHTML={{ __html: safeMessage }} />
      </div>
    );
  },
});

const styles = {
  container: css`
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  `,
};

export default MyComponent;