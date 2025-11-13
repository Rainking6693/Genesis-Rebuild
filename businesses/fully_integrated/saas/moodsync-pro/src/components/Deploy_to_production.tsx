import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';
import classnames from 'classnames';

type Props = DetailedHTMLProps<HTMLDivElement, HTMLDivElement> & {
  message: string;
  className?: string;
  /** Additional aria attributes for accessibility */
  ariaRole?: string;
  ariaLabel?: string;
};

const MoodSyncProComponent: FunctionComponent<Props> = ({ className, message, ariaRole = 'alert', ariaLabel, ...rest }) => {
  const componentClassNames = classnames('moodsync-pro-message', className);

  return (
    <div {...rest} className={componentClassNames} role={ariaRole} aria-label={ariaLabel}>
      {message}
    </div>
  );
};

MoodSyncProComponent.displayName = 'MoodSyncProComponent';

export default MoodSyncProComponent;

import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';
import classnames from 'classnames';

type Props = DetailedHTMLProps<HTMLDivElement, HTMLDivElement> & {
  message: string;
  className?: string;
  /** Additional aria attributes for accessibility */
  ariaRole?: string;
  ariaLabel?: string;
};

const MoodSyncProComponent: FunctionComponent<Props> = ({ className, message, ariaRole = 'alert', ariaLabel, ...rest }) => {
  const componentClassNames = classnames('moodsync-pro-message', className);

  return (
    <div {...rest} className={componentClassNames} role={ariaRole} aria-label={ariaLabel}>
      {message}
    </div>
  );
};

MoodSyncProComponent.displayName = 'MoodSyncProComponent';

export default MoodSyncProComponent;