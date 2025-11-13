import React, { FC, useState } from 'react';
import { SendEmailService } from './SendEmailService';

interface Props {
  service: SendEmailService;
  emailData: {
    recipient: string;
    subject: string;
    message: string;
  };
}

interface State {
  error?: Error;
  isLoading: boolean;
}

const MyComponent: FC<Props> = ({ service, emailData }) => {
  const [state, setState] = useState<State>({ isLoading: false });

  const handleSendEmail = React.useCallback(
    debounce((emailData) => {
      setState({ isLoading: true });
      service.sendEmail(emailData)
        .catch((error) => setState({ error, isLoading: false }))
        .finally(() => setState({ isLoading: false }));
    }, 500),
    []
  );

  return (
    <div>
      {state.error && (
        <div role="alert" aria-label="Error sending email">
          {state.error.message}
        </div>
      )}
      {!state.isLoading && (
        <>
          <h2>{emailData.subject}</h2>
          <p>{emailData.message}</p>
          <button onClick={() => handleSendEmail(emailData)}>
            {state.isLoading ? 'Sending Email...' : 'Send Email'}
          </button>
        </>
      )}
    </div>
  );
};

export default MyComponent;

// Email service refactored with security best practices and made injectable
export interface ISendEmailService {
  sendEmail(emailData: {
    recipient: string;
    subject: string;
    message: string;
  }): Promise<void>;
}

export class SendEmailService implements ISendEmailService {
  // ... (existing code)
}

import React, { FC, useState } from 'react';
import { SendEmailService } from './SendEmailService';

interface Props {
  service: SendEmailService;
  emailData: {
    recipient: string;
    subject: string;
    message: string;
  };
}

interface State {
  error?: Error;
  isLoading: boolean;
}

const MyComponent: FC<Props> = ({ service, emailData }) => {
  const [state, setState] = useState<State>({ isLoading: false });

  const handleSendEmail = React.useCallback(
    debounce((emailData) => {
      setState({ isLoading: true });
      service.sendEmail(emailData)
        .catch((error) => setState({ error, isLoading: false }))
        .finally(() => setState({ isLoading: false }));
    }, 500),
    []
  );

  return (
    <div>
      {state.error && (
        <div role="alert" aria-label="Error sending email">
          {state.error.message}
        </div>
      )}
      {!state.isLoading && (
        <>
          <h2>{emailData.subject}</h2>
          <p>{emailData.message}</p>
          <button onClick={() => handleSendEmail(emailData)}>
            {state.isLoading ? 'Sending Email...' : 'Send Email'}
          </button>
        </>
      )}
    </div>
  );
};

export default MyComponent;

// Email service refactored with security best practices and made injectable
export interface ISendEmailService {
  sendEmail(emailData: {
    recipient: string;
    subject: string;
    message: string;
  }): Promise<void>;
}

export class SendEmailService implements ISendEmailService {
  // ... (existing code)
}