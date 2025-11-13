import React from 'react';

type MessageChildrenType = React.ReactNode;
type MessageProps = React.HTMLProps<HTMLDivElement> & {
  children?: MessageChildrenType;
};

const MessageComponent: React.FC<MessageProps> = ({ children = "No message provided", ...props }) => {
  return <div key={props.id || Math.random()} {...props}>{children}</div>;
};

export { MessageComponent };

type ReturnFlowReportMessageType = string;
type ReturnFlowReportingProps = React.HTMLProps<HTMLDivElement> & {
  reportMessage?: ReturnFlowReportMessageType;
};

const ReturnFlowReportComponent: React.FC<ReturnFlowReportingProps> = ({ reportMessage, ...props }) => {
  if (!reportMessage) {
    return <MessageComponent>No return flow report available</MessageComponent>;
  }

  return <MessageComponent>{reportMessage}</MessageComponent>;
};

export { ReturnFlowReportComponent };

import React from 'react';

type MessageChildrenType = React.ReactNode;
type MessageProps = React.HTMLProps<HTMLDivElement> & {
  children?: MessageChildrenType;
};

const MessageComponent: React.FC<MessageProps> = ({ children = "No message provided", ...props }) => {
  return <div key={props.id || Math.random()} {...props}>{children}</div>;
};

export { MessageComponent };

type ReturnFlowReportMessageType = string;
type ReturnFlowReportingProps = React.HTMLProps<HTMLDivElement> & {
  reportMessage?: ReturnFlowReportMessageType;
};

const ReturnFlowReportComponent: React.FC<ReturnFlowReportingProps> = ({ reportMessage, ...props }) => {
  if (!reportMessage) {
    return <MessageComponent>No return flow report available</MessageComponent>;
  }

  return <MessageComponent>{reportMessage}</MessageComponent>;
};

export { ReturnFlowReportComponent };