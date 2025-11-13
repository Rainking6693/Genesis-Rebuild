import React, { FC, ReactNode, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  message?: string;
}

const SocialMediaPost: FC<Props> = ({ message }) => {
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };

  const content: ReactNode = (
    <div data-testid="social-media-post" key={uuidv4()} role="article">
      {message ? (
        <>
          <div
            className="social-media-post"
            aria-labelledby={`social-media-post-title-${uuidv4()}`}
            title={message}
            maxWidth="100%"
            minWidth="300px"
            dangerouslySetInnerHTML={{ __html: message }}
          />
          <div className="social-media-post-footer">
            <small>
              {message.length > 100
                ? `Read more...`
                : `Read full post...`}
            </small>
          </div>
        </>
      ) : (
        <div>Error: Empty message is not allowed</div>
      )}
      {error && <div>Error: Message contains invalid characters or is too long</div>}
    </div>
  );

  return (
    <>
      {content}
      {message && message.length > 1000 && (
        <div className="accessibility-message">
        </div>
      )}
    </>
  );
};

export default SocialMediaPost;

import React, { FC, ReactNode, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  message?: string;
}

const SocialMediaPost: FC<Props> = ({ message }) => {
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };

  const content: ReactNode = (
    <div data-testid="social-media-post" key={uuidv4()} role="article">
      {message ? (
        <>
          <div
            className="social-media-post"
            aria-labelledby={`social-media-post-title-${uuidv4()}`}
            title={message}
            maxWidth="100%"
            minWidth="300px"
            dangerouslySetInnerHTML={{ __html: message }}
          />
          <div className="social-media-post-footer">
            <small>
              {message.length > 100
                ? `Read more...`
                : `Read full post...`}
            </small>
          </div>
        </>
      ) : (
        <div>Error: Empty message is not allowed</div>
      )}
      {error && <div>Error: Message contains invalid characters or is too long</div>}
    </div>
  );

  return (
    <>
      {content}
      {message && message.length > 1000 && (
        <div className="accessibility-message">
        </div>
      )}
    </>
  );
};

export default SocialMediaPost;