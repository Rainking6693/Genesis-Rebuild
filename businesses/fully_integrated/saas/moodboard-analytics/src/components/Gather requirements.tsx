import React, { FC, PropsWithChildren, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { sanitizeHtml } from 'react-sanitize';
import { makeStyles } from '@material-ui/core/styles';
import { useId } from '@reach/auto-id';

const useStyles = makeStyles({
  moodboardAnalyticsMessage: {
    // Add your custom styles here
    margin: '0',
    padding: '0',
    border: 'none',
    fontSize: '1rem',
    lineHeight: '1.5',
  },
});

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const classes = useStyles();
  const id = useId();

  const sanitizeMessage = (message: string) => {
    try {
      return sanitizeHtml(message, {
        allowedTags: [{ name: 'div', attributes: { id, className: '' } }],
        disallowedTags: ['script', 'style'],
        allowedAttributes: {
          'div': {
            className: [],
            id: [],
          },
        },
        disallowedAttributes: {},
      });
    } catch (error) {
      console.error('Error sanitizing message:', error);
      return (
        <div id={id} className={`${classes.moodboardAnalyticsMessage} moodboard-analytics-message`}>
          Fallback message
        </div>
      );
    }
  };

  const sanitizedMessage = sanitizeMessage(message || '');

  return (
    <div className={`${classes.moodboardAnalyticsMessage} moodboard-analytics-message`}>
      {sanitizedMessage}
    </div>
  );
};

MyComponent.propTypes = {
  message: PropTypes.string,
};

MyComponent.displayName = 'MoodBoardAnalyticsMessage';

export default MyComponent;

import React, { FC, PropsWithChildren, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { sanitizeHtml } from 'react-sanitize';
import { makeStyles } from '@material-ui/core/styles';
import { useId } from '@reach/auto-id';

const useStyles = makeStyles({
  moodboardAnalyticsMessage: {
    // Add your custom styles here
    margin: '0',
    padding: '0',
    border: 'none',
    fontSize: '1rem',
    lineHeight: '1.5',
  },
});

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const classes = useStyles();
  const id = useId();

  const sanitizeMessage = (message: string) => {
    try {
      return sanitizeHtml(message, {
        allowedTags: [{ name: 'div', attributes: { id, className: '' } }],
        disallowedTags: ['script', 'style'],
        allowedAttributes: {
          'div': {
            className: [],
            id: [],
          },
        },
        disallowedAttributes: {},
      });
    } catch (error) {
      console.error('Error sanitizing message:', error);
      return (
        <div id={id} className={`${classes.moodboardAnalyticsMessage} moodboard-analytics-message`}>
          Fallback message
        </div>
      );
    }
  };

  const sanitizedMessage = sanitizeMessage(message || '');

  return (
    <div className={`${classes.moodboardAnalyticsMessage} moodboard-analytics-message`}>
      {sanitizedMessage}
    </div>
  );
};

MyComponent.propTypes = {
  message: PropTypes.string,
};

MyComponent.displayName = 'MoodBoardAnalyticsMessage';

export default MyComponent;