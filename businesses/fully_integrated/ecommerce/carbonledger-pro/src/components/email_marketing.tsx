import React, { FC, ReactNode } from 'react';

interface EmailProps {
  subject?: string;
  from?: string;
  to?: string;
  children: ReactNode;
}

const Email: FC<EmailProps> = ({ subject, from, to, children }) => {
  return (
    <div role="presentation">
      <table role="presentation">
        <tbody>
          {subject && <tr>
            <td>{subject}</td>
          </tr>}
          <tr>
            <td>
              <table role="presentation">
                <tbody>
                  {from && <tr>
                    <td>From:</td>
                    <td>{from}</td>
                  </tr>}
                  {to && <tr>
                    <td>To:</td>
                    <td>{to}</td>
                  </tr>}
                  <tr>
                    <td>{children}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Email;

// email-marketing-component.tsx
import React, { FC } from 'react';
import Email from './email-component';

interface Props {
  subject?: string;
  from?: string;
  to?: string;
  message?: string;
}

const MyComponent: FC<Props> = ({ subject, from, to, message }) => {
  return (
    <div>
      <Email subject={subject} from={from} to={to}>
        {message || 'No message provided'}
      </Email>
    </div>
  );
};

export default MyComponent;

In this example, I used the `email-component-library` for the email component, but you can replace it with any other library or create a custom one if needed. The `email-component` now handles edge cases for empty properties and adds ARIA attributes for accessibility. The `MyComponent` now uses the `email-component` and provides a default message when no message is provided.