import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  id?: string;
}

const MyComponent: React.FC<Props> = ({ message, className, id }) => {
  return (
    <div id={id} className={className}>
      {message}
    </div>
  );
};

MyComponent.defaultProps = {
  className: '',
  id: undefined,
};

export default MyComponent;

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  className?: string;
  id?: string;
}

const MyComponent: React.FC<Props> = ({ message, className, id }) => {
  return (
    <div id={id} className={className}>
      {message}
    </div>
  );
};

MyComponent.defaultProps = {
  className: '',
  id: undefined,
};

export default MyComponent;