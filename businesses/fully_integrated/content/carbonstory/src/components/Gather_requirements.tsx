import React, { FunctionComponent, ReactNode, useState } from 'react';
import PropTypes from 'prop-types';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren<{ message: string }> {
  /**
   * The message to be displayed in the component.
   */
  message: string;

  /**
   * A boolean flag to indicate if the message should be hidden.
   * Defaults to false.
   */
  hidden?: boolean;

  /**
   * An accessibility label for screen readers.
   */
  ariaLabel?: string;

  /**
   * A custom CSS class to be applied to the component.
   */
  className?: string;
}

const CarbonStoryComponent: FunctionComponent<Props> = ({
  message,
  hidden = false,
  ariaLabel,
  children,
  className,
}) => {
  const [isHidden, setIsHidden] = useState(hidden);

  // Handle the hidden prop change to ensure the component re-renders
  const handleHiddenChange = (newHidden: boolean) => {
    setIsHidden(newHidden);
  };

  if (isHidden) {
    return null;
  }

  return (
    <div
      data-testid="carbon-story-component"
      aria-label={ariaLabel}
      className={className}
    >
      {children || message}
    </div>
  );
};

CarbonStoryComponent.defaultProps = {
  message: 'No message provided',
};

CarbonStoryComponent.propTypes = {
  message: PropTypes.string.isRequired,
  hidden: PropTypes.bool,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
};

// Add a controlled component pattern for the hidden prop
CarbonStoryComponent.controlled = {
  hidden: {
    name: 'hidden',
    type: 'boolean',
    defaultValue: false,
  },
};

export default CarbonStoryComponent;

import React, { FunctionComponent, ReactNode, useState } from 'react';
import PropTypes from 'prop-types';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren<{ message: string }> {
  /**
   * The message to be displayed in the component.
   */
  message: string;

  /**
   * A boolean flag to indicate if the message should be hidden.
   * Defaults to false.
   */
  hidden?: boolean;

  /**
   * An accessibility label for screen readers.
   */
  ariaLabel?: string;

  /**
   * A custom CSS class to be applied to the component.
   */
  className?: string;
}

const CarbonStoryComponent: FunctionComponent<Props> = ({
  message,
  hidden = false,
  ariaLabel,
  children,
  className,
}) => {
  const [isHidden, setIsHidden] = useState(hidden);

  // Handle the hidden prop change to ensure the component re-renders
  const handleHiddenChange = (newHidden: boolean) => {
    setIsHidden(newHidden);
  };

  if (isHidden) {
    return null;
  }

  return (
    <div
      data-testid="carbon-story-component"
      aria-label={ariaLabel}
      className={className}
    >
      {children || message}
    </div>
  );
};

CarbonStoryComponent.defaultProps = {
  message: 'No message provided',
};

CarbonStoryComponent.propTypes = {
  message: PropTypes.string.isRequired,
  hidden: PropTypes.bool,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
};

// Add a controlled component pattern for the hidden prop
CarbonStoryComponent.controlled = {
  hidden: {
    name: 'hidden',
    type: 'boolean',
    defaultValue: false,
  },
};

export default CarbonStoryComponent;