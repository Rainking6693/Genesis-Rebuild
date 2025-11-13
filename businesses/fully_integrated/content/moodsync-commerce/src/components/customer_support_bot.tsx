import React, { FC, ReactNode } from 'react';

interface Props {
  message: string;
  children?: ReactNode;
}

const CustomerSupportBot: FC<Props> = ({ message, children = null }) => {
  return (
    <div className="customer-support-bot" role="complementary">
      <h3>MoodSync Commerce Customer Support Bot</h3>
      <p>{message}</p>
      {children}
    </div>
  );
};

export default CustomerSupportBot;

import React, { FC, ReactNode } from 'react';

interface Props {
  message: string;
  children?: ReactNode;
}

const CustomerSupportBot: FC<Props> = ({ message, children = null }) => {
  return (
    <div className="customer-support-bot" role="complementary">
      <h3>MoodSync Commerce Customer Support Bot</h3>
      <p>{message}</p>
      {children}
    </div>
  );
};

export default CustomerSupportBot;