import React, { FunctionComponent, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { sanitizeHtml } from 'dangerously-set-html-content-react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  climatePulseMessage: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    userSelect: 'none',
    boxSizing: 'border-box',
  },
});

const ClimatePulseComponent: FunctionComponent<Props> = ({ message, onMessageFocus }) => {
  const classes = useStyles();

  const sanitize = useCallback((message: string) => {
    ClimatePulseComponent.validateMessageLength(message);
    return sanitizeHtml(message, {
      allowedTags: ['div'],
      allowedAttributes: {},
    });
  }, []);

  const sanitizedMessage = useMemo(() => sanitize(message), [message, sanitize]);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sanitizedMessage && messageRef.current) {
      messageRef.current.focus();
      if (onMessageFocus) {
        onMessageFocus();
      }
    }
  }, [sanitizedMessage, onMessageFocus]);

  return (
    <div className={classes.climatePulseMessage} role="alert" aria-live="polite" ref={messageRef}>
      {sanitizedMessage}
    </div>
  );
};

ClimatePulseComponent.defaultProps = {
  message: 'Welcome to Climate Pulse!',
  onMessageFocus: () => {},
};

ClimatePulseComponent.propTypes = {
  message: PropTypes.string.isRequired,
  onMessageFocus: PropTypes.func,
};

const minimumMessageLength = 5;
const maximumMessageLength = 255;

ClimatePulseComponent.validateMessageLength = (message: string) => {
  if (message.length < minimumMessageLength || message.length > maximumMessageLength) {
    throw new Error(`Message length must be between ${minimumMessageLength} and ${maximumMessageLength}`);
  }
};

ClimatePulseComponent.sanitize = sanitize;

export default ClimatePulseComponent;

import React, { FunctionComponent, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { sanitizeHtml } from 'dangerously-set-html-content-react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  climatePulseMessage: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    userSelect: 'none',
    boxSizing: 'border-box',
  },
});

const ClimatePulseComponent: FunctionComponent<Props> = ({ message, onMessageFocus }) => {
  const classes = useStyles();

  const sanitize = useCallback((message: string) => {
    ClimatePulseComponent.validateMessageLength(message);
    return sanitizeHtml(message, {
      allowedTags: ['div'],
      allowedAttributes: {},
    });
  }, []);

  const sanitizedMessage = useMemo(() => sanitize(message), [message, sanitize]);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sanitizedMessage && messageRef.current) {
      messageRef.current.focus();
      if (onMessageFocus) {
        onMessageFocus();
      }
    }
  }, [sanitizedMessage, onMessageFocus]);

  return (
    <div className={classes.climatePulseMessage} role="alert" aria-live="polite" ref={messageRef}>
      {sanitizedMessage}
    </div>
  );
};

ClimatePulseComponent.defaultProps = {
  message: 'Welcome to Climate Pulse!',
  onMessageFocus: () => {},
};

ClimatePulseComponent.propTypes = {
  message: PropTypes.string.isRequired,
  onMessageFocus: PropTypes.func,
};

const minimumMessageLength = 5;
const maximumMessageLength = 255;

ClimatePulseComponent.validateMessageLength = (message: string) => {
  if (message.length < minimumMessageLength || message.length > maximumMessageLength) {
    throw new Error(`Message length must be between ${minimumMessageLength} and ${maximumMessageLength}`);
  }
};

ClimatePulseComponent.sanitize = sanitize;

export default ClimatePulseComponent;