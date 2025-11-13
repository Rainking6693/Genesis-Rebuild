import React, { FC } from 'react';

interface Props {
  subject: string;
  message: string;
}

const EmailTemplate: FC<Props> = ({ subject, message }) => {
  return (
    <div>
      <h1>{subject}</h1>
      <div>{message}</div>
    </div>
  );
};

export default EmailTemplate;

// Importing React only once for better performance
import React from 'react';

const emailTemplates = {
  welcome: {
    subject: 'Welcome to EcoScore Analytics',
    message: 'We are excited to have you on board! ...',
  },
  // Add more email templates as needed
};

export { emailTemplates };

import React, { FC } from 'react';

interface Props {
  subject: string;
  message: string;
}

const EmailTemplate: FC<Props> = ({ subject, message }) => {
  return (
    <div>
      <h1>{subject}</h1>
      <div>{message}</div>
    </div>
  );
};

export default EmailTemplate;

// Importing React only once for better performance
import React from 'react';

const emailTemplates = {
  welcome: {
    subject: 'Welcome to EcoScore Analytics',
    message: 'We are excited to have you on board! ...',
  },
  // Add more email templates as needed
};

export { emailTemplates };