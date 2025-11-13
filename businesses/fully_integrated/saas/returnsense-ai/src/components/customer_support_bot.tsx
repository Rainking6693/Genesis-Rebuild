import React, { FC, useMemo, ReactNode } from 'react';
import { sanitizeUserInput } from 'security-utils';

interface PropsWithId {
  message: string;
  id?: string;
}

const CustomerSupportBot: FC<PropsWithId> = ({ message, id }) => {
  const sanitizedMessage = sanitizeUserInput(message);
  const memoizedComponent = useMemo(() => {
    if (!id) {
      id = CustomerSupportBot.id;
    }
    return <div id={id} className="customer-support-bot" role="complementary">{sanitizedMessage}</div>;
  }, [id, sanitizedMessage]);

  return memoizedComponent;
};

CustomerSupportBot.displayName = 'CustomerSupportBot';
CustomerSupportBot.id = 'return-sense-ai-customer-support-bot';

export default CustomerSupportBot;

import React, { FC, useMemo, ReactNode } from 'react';
import { sanitizeUserInput } from 'security-utils';

interface PropsWithId {
  message: string;
  id?: string;
}

const CustomerSupportBot: FC<PropsWithId> = ({ message, id }) => {
  const sanitizedMessage = sanitizeUserInput(message);
  const memoizedComponent = useMemo(() => {
    if (!id) {
      id = CustomerSupportBot.id;
    }
    return <div id={id} className="customer-support-bot" role="complementary">{sanitizedMessage}</div>;
  }, [id, sanitizedMessage]);

  return memoizedComponent;
};

CustomerSupportBot.displayName = 'CustomerSupportBot';
CustomerSupportBot.id = 'return-sense-ai-customer-support-bot';

export default CustomerSupportBot;