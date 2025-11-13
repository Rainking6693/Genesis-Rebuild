import React, { ReactNode, ReactElement } from 'react';
import { EmailAddressValidation } from 'email-validator';
import { Email as EmailComponent, EmailProps } from 'email-library'; // Ensure to install the library and provide proper type definitions

interface Props extends EmailProps {
  recipientEmail: string;
}

interface FallbackProps {
  fallbackContent: ReactNode;
  children?: ReactElement | null;
}

const validateEmail = (email: string) => EmailAddressValidation.validate(email);

const MyComponent: React.FC<Props> = ({ recipientEmail, subject = 'Untitled Email', body }) => {
  if (!validateEmail(recipientEmail) || !body) {
    return <div>Error: Invalid email address or empty email body</div>;
  }

  return (
    <div>
      {/* Add a fallback for the Email component in case it fails to render */}
      <FallbackComponent fallbackContent="Email component failed to render">
        <EmailComponent subject={subject} text={body} to={recipientEmail} />
      </FallbackComponent>
    </div>
  );
};

const FallbackComponent: React.FC<FallbackProps> = ({ fallbackContent, children }) =>
  // Render the children if they are not null, otherwise render the fallback content
  <>{children || fallbackContent}</>;

export default MyComponent;

import React, { ReactNode, ReactElement } from 'react';
import { EmailAddressValidation } from 'email-validator';
import { Email as EmailComponent, EmailProps } from 'email-library'; // Ensure to install the library and provide proper type definitions

interface Props extends EmailProps {
  recipientEmail: string;
}

interface FallbackProps {
  fallbackContent: ReactNode;
  children?: ReactElement | null;
}

const validateEmail = (email: string) => EmailAddressValidation.validate(email);

const MyComponent: React.FC<Props> = ({ recipientEmail, subject = 'Untitled Email', body }) => {
  if (!validateEmail(recipientEmail) || !body) {
    return <div>Error: Invalid email address or empty email body</div>;
  }

  return (
    <div>
      {/* Add a fallback for the Email component in case it fails to render */}
      <FallbackComponent fallbackContent="Email component failed to render">
        <EmailComponent subject={subject} text={body} to={recipientEmail} />
      </FallbackComponent>
    </div>
  );
};

const FallbackComponent: React.FC<FallbackProps> = ({ fallbackContent, children }) =>
  // Render the children if they are not null, otherwise render the fallback content
  <>{children || fallbackContent}</>;

export default MyComponent;