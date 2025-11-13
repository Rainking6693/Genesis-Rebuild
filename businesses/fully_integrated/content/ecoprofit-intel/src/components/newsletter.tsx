import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subject: string;
  previewText: string;
  body: string;
}

const allowedTags = ['br'];
const sanitizeBody = (body: string) => {
  const regex = new RegExp(`<([${allowedTags.join('|')}][^>]*)>`, 'gm');
  return body.replace(regex, (match) => match.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*)?(\s*=[^>]*(?:(?:'[^']*')|(?:\"[^\"]*\")))*(\s*(\/)?)?>/, ''));
};

const Newsletter: FC<Props> = ({ subject, previewText, body, className, ...rest }) => {
  const sanitizedBody = sanitizeBody(body);

  return (
    <div className={className} {...rest}>
      <h1>{subject}</h1>
      <p>{previewText}</p>
      <div dangerouslySetInnerHTML={{ __html: sanitizedBody }} />
    </div>
  );
};

Newsletter.defaultProps = {
  className: '',
};

export default Newsletter;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subject: string;
  previewText: string;
  body: string;
}

const allowedTags = ['br'];
const sanitizeBody = (body: string) => {
  const regex = new RegExp(`<([${allowedTags.join('|')}][^>]*)>`, 'gm');
  return body.replace(regex, (match) => match.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*)?(\s*=[^>]*(?:(?:'[^']*')|(?:\"[^\"]*\")))*(\s*(\/)?)?>/, ''));
};

const Newsletter: FC<Props> = ({ subject, previewText, body, className, ...rest }) => {
  const sanitizedBody = sanitizeBody(body);

  return (
    <div className={className} {...rest}>
      <h1>{subject}</h1>
      <p>{previewText}</p>
      <div dangerouslySetInnerHTML={{ __html: sanitizedBody }} />
    </div>
  );
};

Newsletter.defaultProps = {
  className: '',
};

export default Newsletter;