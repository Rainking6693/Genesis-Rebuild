import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const FunctionalComponent: FC<Props> = ({ className, style, message, ...rest }) => {
  const rootClasses = ['saas-message'];
  if (className) rootClasses.push(className);

  return (
    <div className={rootClasses.join(' ')} style={style} {...rest}>
      <p>{message}</p>
    </div>
  );
};

FunctionalComponent.defaultProps = {
  className: '',
  style: {},
};

export default FunctionalComponent;

import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const FunctionalComponent: FC<Props> = ({ className, style, message, ...rest }) => {
  const rootClasses = ['saas-message'];
  if (className) rootClasses.push(className);

  return (
    <div className={rootClasses.join(' ')} style={style} {...rest}>
      <p>{message}</p>
    </div>
  );
};

FunctionalComponent.defaultProps = {
  className: '',
  style: {},
};

export default FunctionalComponent;