import React, { ReactNode, ReactElement, FunctionComponent, ReactPortal } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  className?: string;
  testID?: string;
}

const EcoTraceAIComponent: FunctionComponent<Props> = ({
  message,
  className,
  testID,
}) => {
  const sanitizedMessage = DOMPurify.sanitize(message);

  if (!sanitizedMessage) {
    return null;
  }

  const component: ReactPortal = (
    <div
      role="alert"
      tabIndex={0}
      aria-label="EcoTraceAIComponent"
      className={className}
      data-testid={testID}
    >
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );

  return component;
};

EcoTraceAIComponent.defaultProps = {
  message: '',
  className: '',
  testID: '',
};

EcoTraceAIComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
  testID: PropTypes.string,
};

// Optimize performance by memoizing the component if it's a pure function
const EcoTraceAIComponentMemo = React.memo(EcoTraceAIComponent);

export { EcoTraceAIComponentMemo };
export default EcoTraceAIComponentMemo;

import React, { ReactNode, ReactElement, FunctionComponent, ReactPortal } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  className?: string;
  testID?: string;
}

const EcoTraceAIComponent: FunctionComponent<Props> = ({
  message,
  className,
  testID,
}) => {
  const sanitizedMessage = DOMPurify.sanitize(message);

  if (!sanitizedMessage) {
    return null;
  }

  const component: ReactPortal = (
    <div
      role="alert"
      tabIndex={0}
      aria-label="EcoTraceAIComponent"
      className={className}
      data-testid={testID}
    >
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );

  return component;
};

EcoTraceAIComponent.defaultProps = {
  message: '',
  className: '',
  testID: '',
};

EcoTraceAIComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
  testID: PropTypes.string,
};

// Optimize performance by memoizing the component if it's a pure function
const EcoTraceAIComponentMemo = React.memo(EcoTraceAIComponent);

export { EcoTraceAIComponentMemo };
export default EcoTraceAIComponentMemo;