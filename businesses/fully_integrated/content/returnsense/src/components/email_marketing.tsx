import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subject?: string;
  message: ReactNode;
}

const MyEmailComponent: FC<Props> = ({ className, style, subject = 'Untitled', message, ...rest }) => {
  const emailContainerClasses = 'email-container' + (className ? ` ${className}` : '');

  return (
    <div className={emailContainerClasses} style={style} {...rest}>
      <h1 className="email-subject">{subject}</h1>
      <article className="email-content">
        <p className="email-message">{message}</p>
      </article>
    </div>
  );
};

export default MyEmailComponent;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subject?: string;
  message: ReactNode;
}

const MyEmailComponent: FC<Props> = ({ className, style, subject = 'Untitled', message, ...rest }) => {
  const emailContainerClasses = 'email-container' + (className ? ` ${className}` : '');

  return (
    <div className={emailContainerClasses} style={style} {...rest}>
      <h1 className="email-subject">{subject}</h1>
      <article className="email-content">
        <p className="email-message">{message}</p>
      </article>
    </div>
  );
};

export default MyEmailComponent;