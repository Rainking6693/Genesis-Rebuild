import React, { memo, useMemo } from 'react';

interface ReferralComponentProps {
  title?: string;
  content?: string;
}

const ReferralComponent: React.FC<ReferralComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Referral', [title]);
  const safeContent = useMemo(() => content || 'Refer your friends and earn rewards.', [content]);

  return (
    <div className="referral-component" aria-label="Referral Information">
      <h1 className="referral-title" id="referral-title">
        {safeTitle}
      </h1>
      <p className="referral-content" aria-describedby="referral-title">
        {safeContent}
      </p>
    </div>
  );
});

export default React.memo(ReferralComponent, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.content === nextProps.content
  );
});

import React, { memo, useMemo } from 'react';

interface ReferralComponentProps {
  title?: string;
  content?: string;
}

const ReferralComponent: React.FC<ReferralComponentProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Referral', [title]);
  const safeContent = useMemo(() => content || 'Refer your friends and earn rewards.', [content]);

  return (
    <div className="referral-component" aria-label="Referral Information">
      <h1 className="referral-title" id="referral-title">
        {safeTitle}
      </h1>
      <p className="referral-content" aria-describedby="referral-title">
        {safeContent}
      </p>
    </div>
  );
});

export default React.memo(ReferralComponent, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.content === nextProps.content
  );
});