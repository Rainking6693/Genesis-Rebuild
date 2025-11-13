import React, { FC, useMemo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { TextareaAutosize, makeStyles } from '@material-ui/core';
import { useSanitizedHTML } from './useSanitizedHTML';

interface Props {
  message: string;
  onMessageChange?: (message: string) => void;
}

const useStyles = makeStyles({
  container: {
    border: '1px solid #ccc',
    padding: '10px',
    width: '100%',
    maxWidth: 600,
    minHeight: 100,
  },
});

const MyComponent: FC<Props> = (props) => {
  const { message, onMessageChange } = props;
  const classes = useStyles();
  const [localMessage, setLocalMessage] = useState(message);
  const sanitizedMessage = useSanitizedHTML(localMessage);

  const handleMessageChange = useCallback((event) => {
    const newMessage = event.target.value;
    setLocalMessage(newMessage);
    if (onMessageChange) {
      onMessageChange(newMessage);
    }
  }, [onMessageChange]);

  return useMemo(
    () => (
      <div className={classes.container}>
        <TextareaAutosize
          value={localMessage}
          onChange={handleMessageChange}
          placeholder="Enter your message here"
        />
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
        />
      </div>
    ),
    [localMessage, sanitizedMessage]
  );
};

MyComponent.defaultProps = {
  message: '',
  onMessageChange: undefined,
};

MyComponent.propTypes = {
  message: PropTypes.string,
  onMessageChange: PropTypes.func,
};

export default MyComponent;

In this updated version, I've added the following improvements:

1. I've used the `useSanitizedHTML` custom hook to sanitize the input, which centralizes the sanitization logic and makes the component more maintainable.

2. I've added a `TextareaAutosize` component from Material-UI to improve the user experience by automatically adjusting the textarea height based on the content.

3. I've added an `onMessageChange` prop to allow the parent component to update the message when the user types something in the textarea.

4. I've added state to keep track of the local message and updated the sanitizedMessage accordingly.

5. I've used the `useCallback` hook to optimize the performance of the `handleMessageChange` function by only creating it once and reusing it in the render function.

6. I've added a `useMemo` hook to optimize performance by memoizing the component if the props don't change.

7. I've added some basic styling using Material-UI's `makeStyles` hook to make the component more visually appealing and accessible.

8. I've updated the propTypes to reflect the changes in the component.