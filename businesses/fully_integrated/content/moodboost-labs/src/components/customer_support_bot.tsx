import React from 'react';
import DOMPurify from 'dompurify';
import { DefaultHTMLProps, forwardRef } from 'react';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  children?: string;
  isLoading?: boolean;
  className?: string;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  testID?: string;
}

const CustomerSupportBot: React.FC<Props> = forwardRef<HTMLDivElement, Props>(({ children, isLoading, className, title, onClick, testID, ...rest }, ref) => {
  const sanitizedChildren = DOMPurify.sanitize(children);

  return (
    <div
      ref={ref}
      {...rest}
      className={className}
      title={title}
      onClick={onClick}
      data-testid={testID}
    >
      {isLoading ? <div>Loading...</div> : sanitizedChildren}
    </div>
  );
});

export default CustomerSupportBot;

import React from 'react';
import DOMPurify from 'dompurify';
import { DefaultHTMLProps, forwardRef } from 'react';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  children?: string;
  isLoading?: boolean;
  className?: string;
  title?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  testID?: string;
}

const CustomerSupportBot: React.FC<Props> = forwardRef<HTMLDivElement, Props>(({ children, isLoading, className, title, onClick, testID, ...rest }, ref) => {
  const sanitizedChildren = DOMPurify.sanitize(children);

  return (
    <div
      ref={ref}
      {...rest}
      className={className}
      title={title}
      onClick={onClick}
      data-testid={testID}
    >
      {isLoading ? <div>Loading...</div> : sanitizedChildren}
    </div>
  );
});

export default CustomerSupportBot;