import React, { FC, useMemo, Ref, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cleanHTML } from 'html-react-parser';

interface Props {
  message: string;
}

const MAX_MESSAGE_LENGTH = 1000;

const MemoizedEcoBoostAnalyticsCheckoutComponent: FC<Props & React.RefAttributes<Ref<HTMLDivElement>>> = forwardRef(
  (
    { message, ...rest },
    ref: Ref<HTMLDivElement>
  ) => {
    const sanitizedMessage = useMemo(
      () => (message && message.length <= MAX_MESSAGE_LENGTH ? cleanHTML(message) : ''),
      [message]
    );

    if (sanitizedMessage) {
      return (
        <div ref={ref} {...rest} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} aria-label={sanitizedMessage} />
      );
    }

    return null;
  }
);

MemoizedEcoBoostAnalyticsCheckoutComponent.displayName = 'MemoizedEcoBoostAnalyticsCheckoutComponent';

MemoizedEcoBoostAnalyticsCheckoutComponent.defaultProps = {
  message: '',
};

MemoizedEcoBoostAnalyticsCheckoutComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

MemoizedEcoBoostAnalyticsCheckoutComponent.propTypes.shape = {
  ...PropTypes.shape({
    children: PropTypes.node,
  }),
  ref: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.instanceOf(HTMLDivElement) })]),
};

MemoizedEcoBoostAnalyticsCheckoutComponent.minProps = {
  message: PropTypes.string.isRequired,
};

// Import necessary libraries for input validation
import PropTypes from 'prop-types';

// Use a more descriptive component name
export { MemoizedEcoBoostAnalyticsCheckoutComponent };

This updated code addresses the concerns of resiliency, edge cases, accessibility, and maintainability for the `EcoBoostAnalyticsCheckoutComponent`.