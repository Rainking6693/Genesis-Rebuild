import React, { useState, useEffect, useRef } from 'react';

interface AlertProps {
  isError?: boolean;
  message?: string;
}

const Alert: React.FC<AlertProps> = ({ isError = false, message }) => {
  const [alertVariant, setAlertVariant] = useState<string>('');
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (alertRef.current) {
      setAlertVariant(isError ? 'error' : 'success');
      alertRef.current.classList.add(`alert-${alertVariant}`);
    }

    return () => {
      if (alertRef.current) {
        alertRef.current.remove();
      }
    };
  }, [isError, message]);

  return (
    <div ref={alertRef} className="alert" role="alert" aria-label={`${isError ? 'Error' : 'Success'} message`}>
      <div className={`alert-content alert-${alertVariant}`}>
        {message}
      </div>
    </div>
  );
};

export default Alert;

import React, { useState, useEffect, useRef } from 'react';

interface AlertProps {
  isError?: boolean;
  message?: string;
}

const Alert: React.FC<AlertProps> = ({ isError = false, message }) => {
  const [alertVariant, setAlertVariant] = useState<string>('');
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (alertRef.current) {
      setAlertVariant(isError ? 'error' : 'success');
      alertRef.current.classList.add(`alert-${alertVariant}`);
    }

    return () => {
      if (alertRef.current) {
        alertRef.current.remove();
      }
    };
  }, [isError, message]);

  return (
    <div ref={alertRef} className="alert" role="alert" aria-label={`${isError ? 'Error' : 'Success'} message`}>
      <div className={`alert-content alert-${alertVariant}`}>
        {message}
      </div>
    </div>
  );
};

export default Alert;