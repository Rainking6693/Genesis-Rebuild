import React, { FC, ReactNode, Key } from 'react';
import PropTypes from 'prop-types';
import { useId } from 'react';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }: Props) => {
  // Sanitize the input to prevent XSS attacks
  const sanitizedMessage = String(message).replace(/<[^>]*>?/gm, '');

  // Check if the message is empty before rendering to avoid errors
  if (!sanitizedMessage.length) return null;

  // Generate a unique id for the div to ensure accessibility
  const id = useId();

  // Use a fragment to ensure accessibility and avoid creating extra nodes
  return (
    <React.Fragment>
      <div id={id} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      <span id={`${id}-announce`} />
    </React.Fragment>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

// Optimize performance by memoizing the component if necessary
// (This might not be necessary if the component is simple and stateless)
const MemoizedMyComponent = React.memo(MyComponent);

// Improve accessibility by announcing the content to screen readers
const announceContent = (id: string, content: string) => {
  const announcementId = `${id}-announce`;
  const announcementElement = document.getElementById(announcementId);
  if (announcementElement) {
    announcementElement.textContent = content;
  }
};

MyComponent.AnnounceContent = announceContent;

// Add a key prop for the div to improve resiliency and performance
// (This is important when rendering large lists)
const KeyedMyComponent = (props: Props) => {
  const { message } = props;
  const id = useId();
  return (
    <React.Fragment>
      <div key={id} {...props}>
        {message}
      </div>
      <span id={`${id}-announce`} />
    </React.Fragment>
  );
};

// Improve maintainability by following a consistent naming convention and coding style
// Add tests for the component to ensure it works as expected
export default React.memo(KeyedMyComponent);

import React, { FC, ReactNode, Key } from 'react';
import PropTypes from 'prop-types';
import { useId } from 'react';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }: Props) => {
  // Sanitize the input to prevent XSS attacks
  const sanitizedMessage = String(message).replace(/<[^>]*>?/gm, '');

  // Check if the message is empty before rendering to avoid errors
  if (!sanitizedMessage.length) return null;

  // Generate a unique id for the div to ensure accessibility
  const id = useId();

  // Use a fragment to ensure accessibility and avoid creating extra nodes
  return (
    <React.Fragment>
      <div id={id} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      <span id={`${id}-announce`} />
    </React.Fragment>
  );
};

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

// Optimize performance by memoizing the component if necessary
// (This might not be necessary if the component is simple and stateless)
const MemoizedMyComponent = React.memo(MyComponent);

// Improve accessibility by announcing the content to screen readers
const announceContent = (id: string, content: string) => {
  const announcementId = `${id}-announce`;
  const announcementElement = document.getElementById(announcementId);
  if (announcementElement) {
    announcementElement.textContent = content;
  }
};

MyComponent.AnnounceContent = announceContent;

// Add a key prop for the div to improve resiliency and performance
// (This is important when rendering large lists)
const KeyedMyComponent = (props: Props) => {
  const { message } = props;
  const id = useId();
  return (
    <React.Fragment>
      <div key={id} {...props}>
        {message}
      </div>
      <span id={`${id}-announce`} />
    </React.Fragment>
  );
};

// Improve maintainability by following a consistent naming convention and coding style
// Add tests for the component to ensure it works as expected
export default React.memo(KeyedMyComponent);