import React, { ReactNode, Key } from 'react';

interface MessageProps {
  id?: string;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
  key?: Key; // Added key for better React performance
}

const Message: React.FC<MessageProps> = ({ children, id, className, ariaLabel, key }) => {
  return (
    <div id={id} className={className} aria-label={ariaLabel} key={key}>
      {children}
    </div>
  );
};

export { Message };

// Usage example:
import Message from './Message';

const RetentionLabContent = () => {
  const churnPredictionMessage = {
    id: 'churn-prediction-message',
    children: 'Predicted customer churn. Here is a personalized email sequence to help retain them.',
    ariaLabel: 'Churn prediction message',
  };
  const inAppMessage = {
    id: 'in-app-message',
    children: 'We noticed you haven\'t made a purchase in a while. Here are some exclusive deals just for you.',
    ariaLabel: 'In-app message',
  };
  const loyaltyProgramContent = {
    id: 'loyalty-program-content',
    children: 'Welcome to our loyalty program! Earn points with every purchase and redeem them for exclusive rewards.',
    ariaLabel: 'Loyalty program content',
  };

  return (
    <>
      <Message key={churnPredictionMessage.id} {...churnPredictionMessage} />
      <Message key={inAppMessage.id} {...inAppMessage} />
      <Message key={loyaltyProgramContent.id} {...loyaltyProgramContent} />
    </>
  );
};

export default RetentionLabContent;

import React, { ReactNode, Key } from 'react';

interface MessageProps {
  id?: string;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
  key?: Key; // Added key for better React performance
}

const Message: React.FC<MessageProps> = ({ children, id, className, ariaLabel, key }) => {
  return (
    <div id={id} className={className} aria-label={ariaLabel} key={key}>
      {children}
    </div>
  );
};

export { Message };

// Usage example:
import Message from './Message';

const RetentionLabContent = () => {
  const churnPredictionMessage = {
    id: 'churn-prediction-message',
    children: 'Predicted customer churn. Here is a personalized email sequence to help retain them.',
    ariaLabel: 'Churn prediction message',
  };
  const inAppMessage = {
    id: 'in-app-message',
    children: 'We noticed you haven\'t made a purchase in a while. Here are some exclusive deals just for you.',
    ariaLabel: 'In-app message',
  };
  const loyaltyProgramContent = {
    id: 'loyalty-program-content',
    children: 'Welcome to our loyalty program! Earn points with every purchase and redeem them for exclusive rewards.',
    ariaLabel: 'Loyalty program content',
  };

  return (
    <>
      <Message key={churnPredictionMessage.id} {...churnPredictionMessage} />
      <Message key={inAppMessage.id} {...inAppMessage} />
      <Message key={loyaltyProgramContent.id} {...loyaltyProgramContent} />
    </>
  );
};

export default RetentionLabContent;