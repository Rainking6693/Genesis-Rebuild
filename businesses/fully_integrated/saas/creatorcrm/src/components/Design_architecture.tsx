import React, { FunctionComponent, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

interface Props {
  children?: ReactNode;
  message?: string;
}

const isValidMessage = (message: string): boolean => {
  return !isEmpty(message) && typeof message === 'string';
};

const CreatorCRMComponent: FunctionComponent<Props> = ({ children, message }: Props) => {
  if (isValidMessage(message)) {
    return <div className="crm-message" role="alert" data-testid="crm-message">{message}</div>;
  }

  if (children) {
    return <div className="crm-content" role="main" data-testid="crm-content">{children}</div>;
  }

  return <div className="crm-message" role="alert" data-testid="crm-message">Welcome to CreatorCRM!</div>;
};

CreatorCRMComponent.defaultProps = {
  children: null as ReactNode,
  message: '',
};

CreatorCRMComponent.propTypes = {
  children: PropTypes.node,
  message: PropTypes.string,
};

export default CreatorCRMComponent;

import React, { FunctionComponent, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

interface Props {
  children?: ReactNode;
  message?: string;
}

const isValidMessage = (message: string): boolean => {
  return !isEmpty(message) && typeof message === 'string';
};

const CreatorCRMComponent: FunctionComponent<Props> = ({ children, message }: Props) => {
  if (isValidMessage(message)) {
    return <div className="crm-message" role="alert" data-testid="crm-message">{message}</div>;
  }

  if (children) {
    return <div className="crm-content" role="main" data-testid="crm-content">{children}</div>;
  }

  return <div className="crm-message" role="alert" data-testid="crm-message">Welcome to CreatorCRM!</div>;
};

CreatorCRMComponent.defaultProps = {
  children: null as ReactNode,
  message: '',
};

CreatorCRMComponent.propTypes = {
  children: PropTypes.node,
  message: PropTypes.string,
};

export default CreatorCRMComponent;