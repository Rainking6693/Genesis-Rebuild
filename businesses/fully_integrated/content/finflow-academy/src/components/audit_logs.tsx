import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import a popular HTTP client for logging events

interface Props {
  message: string;
}

const AuditLog: React.FC<Props> = ({ message }) => {
  // Add a unique identifier for each log entry
  const [logId, setLogId] = useState(0);

  // Generate a unique logId on component mount and update if the message changes
  useEffect(() => {
    setLogId(new Date().getTime() + Math.floor(Math.random() * 1000000));
  }, [message]);

  // Log the event to a centralized logging service (e.g., Sentry, Loggly, etc.)
  // This implementation uses Axios for HTTP requests
  const logEvent = async (message: string) => {
    try {
      await axios.post('/api/logs', { message, logId });
    } catch (error) {
      // Log the error to a secondary logging service or display an error message
      console.error(`Error logging event: ${error.message}`);
    }
  };

  // Call the logEvent function with the provided message and the unique logId
  useEffect(() => {
    logEvent(`${message} - LogId: ${logId}`);
  }, [message, logId]);

  return (
    <div>
      {/* Add a role attribute for screen readers */}
      <div role="log" data-log-id={logId}>{message}</div>
    </div>
  );
};

export default AuditLog;

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import a popular HTTP client for logging events

interface Props {
  message: string;
}

const AuditLog: React.FC<Props> = ({ message }) => {
  // Add a unique identifier for each log entry
  const [logId, setLogId] = useState(0);

  // Generate a unique logId on component mount and update if the message changes
  useEffect(() => {
    setLogId(new Date().getTime() + Math.floor(Math.random() * 1000000));
  }, [message]);

  // Log the event to a centralized logging service (e.g., Sentry, Loggly, etc.)
  // This implementation uses Axios for HTTP requests
  const logEvent = async (message: string) => {
    try {
      await axios.post('/api/logs', { message, logId });
    } catch (error) {
      // Log the error to a secondary logging service or display an error message
      console.error(`Error logging event: ${error.message}`);
    }
  };

  // Call the logEvent function with the provided message and the unique logId
  useEffect(() => {
    logEvent(`${message} - LogId: ${logId}`);
  }, [message, logId]);

  return (
    <div>
      {/* Add a role attribute for screen readers */}
      <div role="log" data-log-id={logId}>{message}</div>
    </div>
  );
};

export default AuditLog;