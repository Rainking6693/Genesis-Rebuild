import React, { FC, PropsWithChildren, Ref, forwardRef } from 'react';
import { DetailedHTMLProps } from 'react';
import DOMPurify from 'dompurify';

interface AuditLogMessageProps extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: React.ReactNode;
  title?: string;
  dataTestid?: string;
  maxWidth?: string;
  minLines?: number;
  noWrap?: boolean;
}

const sanitizeOptions = {
  ALLOWED_TAGS: ['span', 'strong', 'em', 'a', 'br'],
  ALLOWED_ATTRS: {
    a: ['href', 'target'],
  },
  FORBID_TAGS: [],
  FORBID_ATTRS: {},
  FORBID_CSS: [],
};

const AuditLogMessage: FC<AuditLogMessageProps> = forwardRef<HTMLDivElement, AuditLogMessageProps>(({ className, message, title, children, dataTestid, maxWidth, minLines, noWrap, ...props }, ref) => {
  const sanitizedMessage = DOMPurify.sanitize(message, sanitizeOptions);

  return (
    <div
      ref={ref}
      className={className}
      data-testid={dataTestid}
      title={title}
      style={{ maxWidth, minLines, whiteSpace: noWrap ? 'nowrap' : undefined, ...props.style }}
      {...props}
    >
      {children}
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
});

export default AuditLogMessage;

In this updated code, I've added support for passing additional content via the `children` prop, provided a `title` prop for tooltips, added a `dataTestid` prop for easier testing, and limited the width of the log message with the `maxWidth` prop. I've also added the `minLines` and `noWrap` props to control the layout of the log message. Lastly, I've customized the sanitization process using the `sanitizeOptions` object.