import React, { FC, ReactNode, useId } from 'react';

interface Props {
  message: string;
  children?: ReactNode;
}

const ReviewRocketEmailMarketingComponent: FC<Props> = ({ message, children }) => {
  const componentId = useId();

  return (
    <div>
      {/* Add a unique identifier for accessibility purposes */}
      <div id={componentId} role="presentation">
        {message}
        {children}
      </div>
    </div>
  );
};

export default ReviewRocketEmailMarketingComponent;

import React, { FC, ReactNode, useId } from 'react';

interface Props {
  message: string;
  children?: ReactNode;
}

const ReviewRocketEmailMarketingComponent: FC<Props> = ({ message, children }) => {
  const componentId = useId();

  return (
    <div>
      {/* Add a unique identifier for accessibility purposes */}
      <div id={componentId} role="presentation">
        {message}
        {children}
      </div>
    </div>
  );
};

export default ReviewRocketEmailMarketingComponent;