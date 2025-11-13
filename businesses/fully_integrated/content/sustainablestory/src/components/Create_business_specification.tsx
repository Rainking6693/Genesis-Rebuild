import React, { FC, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { isValidElementType, cloneElement } from 'react';

interface Props {
  message: string;
}

const MyComponentBase: FC<Props> = ({ message }, ref) => {
  const [error, setError] = useState(false);

  const handleError = (error: Error) => {
    setError(true);
    console.error(error);
  };

  const memoizedComponent = useMemo(() => {
    try {
      const parsedMessage = new DOMParser().parseFromString(message, 'text/html');
      return cloneElement(parsedMessage.firstChild, {
        dangerouslySetInnerHTML: { __html: message },
      });
    } catch (error) {
      handleError(error);
      return <div>An error occurred while rendering the content.</div>;
    }
  }, [message, error]);

  return error ? (
    <div>
      An error occurred while rendering the content. Please refresh the page.
      <a href="" onClick={() => window.location.reload()}>
        Refresh
      </a>
    </div>
  ) : memoizedComponent;
};

MyComponentBase.defaultProps = {
  message: '',
};

MyComponentBase.propTypes = {
  message: PropTypes.string.isRequired,
};

const MyComponentWithForwardRef = forwardRef(MyComponentBase);

export default React.memo(MyComponentWithForwardRef);

import React, { FC, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { isValidElementType, cloneElement } from 'react';

interface Props {
  message: string;
}

const MyComponentBase: FC<Props> = ({ message }, ref) => {
  const [error, setError] = useState(false);

  const handleError = (error: Error) => {
    setError(true);
    console.error(error);
  };

  const memoizedComponent = useMemo(() => {
    try {
      const parsedMessage = new DOMParser().parseFromString(message, 'text/html');
      return cloneElement(parsedMessage.firstChild, {
        dangerouslySetInnerHTML: { __html: message },
      });
    } catch (error) {
      handleError(error);
      return <div>An error occurred while rendering the content.</div>;
    }
  }, [message, error]);

  return error ? (
    <div>
      An error occurred while rendering the content. Please refresh the page.
      <a href="" onClick={() => window.location.reload()}>
        Refresh
      </a>
    </div>
  ) : memoizedComponent;
};

MyComponentBase.defaultProps = {
  message: '',
};

MyComponentBase.propTypes = {
  message: PropTypes.string.isRequired,
};

const MyComponentWithForwardRef = forwardRef(MyComponentBase);

export default React.memo(MyComponentWithForwardRef);