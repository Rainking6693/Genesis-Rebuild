import React, { FC, PropsWithChildren, DefaultHTMLProps } from 'react';
import { sanitizeHtml } from 'sanitize-html';
import classnames from 'classnames';

type MessageType = string;

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  message: MessageType;
  className?: string;
  key?: string;
}

const CustomerSupportBot: FC<Props> = ({ className, message, key, ...rest }) => {
  // Sanitize the message before rendering to ensure security best practices
  const sanitizedMessage = typeof message === 'string' ? sanitizeHtml(message, {
    allowedTags: ['div'],
    allowedAttributes: {},
  }) : '';

  return <div className={classnames('customer-support-bot', className)} key={key} {...rest}>{sanitizedMessage}</div>;
};

CustomerSupportBot.defaultProps = {
  className: '',
  key: `${Math.random().toString(36).substring(2, 15)}`,
};

export default CustomerSupportBot;

import React, { FC, PropsWithChildren, DefaultHTMLProps } from 'react';
import { sanitizeHtml } from 'sanitize-html';
import classnames from 'classnames';

type MessageType = string;

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  message: MessageType;
  className?: string;
  key?: string;
}

const CustomerSupportBot: FC<Props> = ({ className, message, key, ...rest }) => {
  // Sanitize the message before rendering to ensure security best practices
  const sanitizedMessage = typeof message === 'string' ? sanitizeHtml(message, {
    allowedTags: ['div'],
    allowedAttributes: {},
  }) : '';

  return <div className={classnames('customer-support-bot', className)} key={key} {...rest}>{sanitizedMessage}</div>;
};

CustomerSupportBot.defaultProps = {
  className: '',
  key: `${Math.random().toString(36).substring(2, 15)}`,
};

export default CustomerSupportBot;