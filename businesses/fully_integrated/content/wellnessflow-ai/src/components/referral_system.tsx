import React from 'react';

interface ReferralSystemMessageProps {
  id: string;
  message: string;
}

interface ReferralSystemMessageDefaultProps {
  message: string;
}

const ReferralSystemMessage: FC<ReferralSystemMessageProps & ReferralSystemMessageDefaultProps> = ({ id, message }) => {
  return (
    <div id={id}>
      <div aria-labelledby={id} role="alert">
        {message}
      </div>
    </div>
  );
};

ReferralSystemMessage.defaultProps = {
  message: 'Invite your colleagues to join WellnessFlow AI and earn rewards!',
};

const ReferralSystemMessageIdGenerator = () => {
  const id = useId();
  return id;
};

const ReferralSystem: FC = () => {
  const messageId = ReferralSystemMessageIdGenerator();

  return (
    <div>
      <ReferralSystemMessage id={messageId} />
      {/* Add more components as needed, such as a form for entering referral codes, a list of referrals, and a rewards section */}
    </div>
  );
};

export default ReferralSystem;

import React from 'react';

interface ReferralSystemMessageProps {
  id: string;
  message: string;
}

interface ReferralSystemMessageDefaultProps {
  message: string;
}

const ReferralSystemMessage: FC<ReferralSystemMessageProps & ReferralSystemMessageDefaultProps> = ({ id, message }) => {
  return (
    <div id={id}>
      <div aria-labelledby={id} role="alert">
        {message}
      </div>
    </div>
  );
};

ReferralSystemMessage.defaultProps = {
  message: 'Invite your colleagues to join WellnessFlow AI and earn rewards!',
};

const ReferralSystemMessageIdGenerator = () => {
  const id = useId();
  return id;
};

const ReferralSystem: FC = () => {
  const messageId = ReferralSystemMessageIdGenerator();

  return (
    <div>
      <ReferralSystemMessage id={messageId} />
      {/* Add more components as needed, such as a form for entering referral codes, a list of referrals, and a rewards section */}
    </div>
  );
};

export default ReferralSystem;