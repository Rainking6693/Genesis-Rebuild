import React, { FC, useId } from 'react';

interface Props {
  message: string;
  className?: string;
  id?: string;
  isError?: boolean; // Added to handle error logs
}

const AuditLog: FC<Props> = ({ message, className = '', id, isError = false }) => {
  const logId = id || useId();

  // Added a conditional className for error logs
  const logClassName = isError ? 'audit-log error' : `audit-log ${className || ''}`;

  return (
    <div id={logId} className={logClassName}>
      {message}
    </div>
  );
};

export default AuditLog;

import React from 'react';
import AuditLog from './AuditLog';

const MyComponent = () => {
  return (
    <>
      <AuditLog message="User logged in" className="success" />
      <AuditLog message="Order created" id="order-created-log" />
      <AuditLog message="Error occurred" isError={true} /> // Added error log
    </>
  );
};

export default MyComponent;

import React, { FC, useId } from 'react';

interface Props {
  message: string;
  className?: string;
  id?: string;
  isError?: boolean; // Added to handle error logs
}

const AuditLog: FC<Props> = ({ message, className = '', id, isError = false }) => {
  const logId = id || useId();

  // Added a conditional className for error logs
  const logClassName = isError ? 'audit-log error' : `audit-log ${className || ''}`;

  return (
    <div id={logId} className={logClassName}>
      {message}
    </div>
  );
};

export default AuditLog;

import React from 'react';
import AuditLog from './AuditLog';

const MyComponent = () => {
  return (
    <>
      <AuditLog message="User logged in" className="success" />
      <AuditLog message="Order created" id="order-created-log" />
      <AuditLog message="Error occurred" isError={true} /> // Added error log
    </>
  );
};

export default MyComponent;