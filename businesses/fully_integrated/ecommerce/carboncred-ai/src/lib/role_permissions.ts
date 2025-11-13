import React, { FC, ReactNode } from 'react';

interface MessageProps {
  children: ReactNode;
  className?: string; // Adding a className prop for styling
}

const MessageComponent: FC<MessageProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

interface CarbonCredAIMessageProps extends MessageProps {
  message: string;
  isCarbonCredAIMessage?: boolean; // Adding an optional isCarbonCredAIMessage prop for future use
}

const CarbonCredAIMessage: FC<CarbonCredAIMessageProps> = (props) => {
  const { isCarbonCredAIMessage, ...rest } = props;
  return <MessageComponent {...rest} />;
};

interface MyComponentProps extends MessageProps {
  message: string;
}

const MyComponent: FC<MyComponentProps> = (props) => {
  return <MessageComponent {...props} />;
};

export { CarbonCredAIMessage, MyComponent };

import React, { FC, ReactNode } from 'react';

interface MessageProps {
  children: ReactNode;
  className?: string; // Adding a className prop for styling
}

const MessageComponent: FC<MessageProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

interface CarbonCredAIMessageProps extends MessageProps {
  message: string;
  isCarbonCredAIMessage?: boolean; // Adding an optional isCarbonCredAIMessage prop for future use
}

const CarbonCredAIMessage: FC<CarbonCredAIMessageProps> = (props) => {
  const { isCarbonCredAIMessage, ...rest } = props;
  return <MessageComponent {...rest} />;
};

interface MyComponentProps extends MessageProps {
  message: string;
}

const MyComponent: FC<MyComponentProps> = (props) => {
  return <MessageComponent {...props} />;
};

export { CarbonCredAIMessage, MyComponent };