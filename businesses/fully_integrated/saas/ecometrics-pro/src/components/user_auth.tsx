import React, { FC, useEffect, useState } from 'react';

interface Props {
  message: string;
  error?: string;
}

const MyComponent: FC<Props> = ({ message, error }) => {
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    if (error) {
      setShowMessage(false);
    }
  }, [error]);

  return (
    <div>
      {showMessage && <p>{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';

interface Props {
  message: string;
  error?: string;
}

const MyComponent: FC<Props> = ({ message, error }) => {
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    if (error) {
      setShowMessage(false);
    }
  }, [error]);

  return (
    <div>
      {showMessage && <p>{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default MyComponent;