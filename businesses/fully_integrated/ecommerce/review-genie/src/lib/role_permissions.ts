import React, { FC, ReactNode } from 'react';

interface BaseMessageProps {
  className?: string;
  title?: string;
  variant?: 'error' | 'success' | 'warning';
}

const BaseMessage: FC<BaseMessageProps> = ({ children, className = 'base-message', title, variant, ...rest }) => {
  const messageClass = `${className} ${variant ? `message-${variant}` : ''}`;

  return (
    <div className={messageClass} role="alert" aria-label={title} {...rest}>
      {children}
    </div>
  );
};

interface ReviewMessageProps extends BaseMessageProps {
  message: string;
}

interface ProductMessageProps extends BaseMessageProps {
  message: string;
}

const ReviewMessage: FC<ReviewMessageProps> = ({ message, className, title, variant }) => {
  return <BaseMessage className="review-message" title={title} message={message} variant={variant} />;
};

const ProductMessage: FC<ProductMessageProps> = ({ message, className, title, variant }) => {
  return <BaseMessage className="product-message" title={title} message={message} variant={variant} />;
};

export { ReviewMessage, ProductMessage };

import React, { FC, ReactNode } from 'react';

interface BaseMessageProps {
  className?: string;
  title?: string;
  variant?: 'error' | 'success' | 'warning';
}

const BaseMessage: FC<BaseMessageProps> = ({ children, className = 'base-message', title, variant, ...rest }) => {
  const messageClass = `${className} ${variant ? `message-${variant}` : ''}`;

  return (
    <div className={messageClass} role="alert" aria-label={title} {...rest}>
      {children}
    </div>
  );
};

interface ReviewMessageProps extends BaseMessageProps {
  message: string;
}

interface ProductMessageProps extends BaseMessageProps {
  message: string;
}

const ReviewMessage: FC<ReviewMessageProps> = ({ message, className, title, variant }) => {
  return <BaseMessage className="review-message" title={title} message={message} variant={variant} />;
};

const ProductMessage: FC<ProductMessageProps> = ({ message, className, title, variant }) => {
  return <BaseMessage className="product-message" title={title} message={message} variant={variant} />;
};

export { ReviewMessage, ProductMessage };