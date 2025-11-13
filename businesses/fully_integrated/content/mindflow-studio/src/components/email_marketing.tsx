import React, { FC, ReactNode, useRef } from 'react';

interface Props {
  subject: string; // Add subject for email personalization
  message: string | JSX.Element; // Allow for more complex content like HTML or components
  htmlContentId?: string; // Optional ID for the HTML content to enable accessibility
}

const MyEmailComponent: FC<Props> = ({ subject, message, htmlContentId }) => {
  const htmlContentRef = useRef(null);

  // Wrap subject in an h3 tag for better readability
  return (
    <div>
      <h3 id={htmlContentId}>{subject}</h3>

      {/* Use a div to wrap the message and apply the dangerouslySetInnerHTML only when the message is HTML content */}
      {typeof message === 'string' ? (
        <div dangerouslySetInnerHTML={{ __html: message }} />
      ) : (
        message
      )}

      {/* If the message is HTML content, set the ID of the div to the same as the subject ID for accessibility */}
      {htmlContentId && (
        <>
          <hr />
          <div id={htmlContentId} />
        </>
      )}
    </div>
  );
};

export default MyEmailComponent;

import React, { FC, ReactNode, useRef } from 'react';

interface Props {
  subject: string; // Add subject for email personalization
  message: string | JSX.Element; // Allow for more complex content like HTML or components
  htmlContentId?: string; // Optional ID for the HTML content to enable accessibility
}

const MyEmailComponent: FC<Props> = ({ subject, message, htmlContentId }) => {
  const htmlContentRef = useRef(null);

  // Wrap subject in an h3 tag for better readability
  return (
    <div>
      <h3 id={htmlContentId}>{subject}</h3>

      {/* Use a div to wrap the message and apply the dangerouslySetInnerHTML only when the message is HTML content */}
      {typeof message === 'string' ? (
        <div dangerouslySetInnerHTML={{ __html: message }} />
      ) : (
        message
      )}

      {/* If the message is HTML content, set the ID of the div to the same as the subject ID for accessibility */}
      {htmlContentId && (
        <>
          <hr />
          <div id={htmlContentId} />
        </>
      )}
    </div>
  );
};

export default MyEmailComponent;