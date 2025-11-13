import React, { FC, DetailedHTMLProps } from 'react';

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ className, id, style, message, ...rest }) => {
  const seoFriendlyMessage = message.toLowerCase().replace(/[^a-z0-9-]+/g, '-');

  return (
    <div id={id} className={className} style={style} {...rest}>
      <h1 className="sr-only">{seoFriendlyMessage}</h1>
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};

MyComponent.defaultProps = {
  className: '',
  id: seoFriendlyMessage,
  style: {},
};

export default MyComponent;

import React, { FC, DetailedHTMLProps } from 'react';

interface Props extends DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
}

const MyComponent: FC<Props> = ({ className, id, style, message, ...rest }) => {
  const seoFriendlyMessage = message.toLowerCase().replace(/[^a-z0-9-]+/g, '-');

  return (
    <div id={id} className={className} style={style} {...rest}>
      <h1 className="sr-only">{seoFriendlyMessage}</h1>
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};

MyComponent.defaultProps = {
  className: '',
  id: seoFriendlyMessage,
  style: {},
};

export default MyComponent;