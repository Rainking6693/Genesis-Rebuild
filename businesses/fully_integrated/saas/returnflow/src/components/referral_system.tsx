import React, { memo, useMemo } from 'react';

interface ReferralCardProps {
  title?: string;
  content?: string;
}

const ReferralCard: React.FC<ReferralCardProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Referral Card', [title]);
  const safeContent = useMemo(() => content || 'No content provided.', [content]);

  return (
    <div className="referral-card" aria-label="Referral Card">
      <h2 className="referral-card__title" aria-label="Card Title">
        {safeTitle}
      </h2>
      <p className="referral-card__content" aria-label="Card Content">
        {safeContent}
      </p>
    </div>
  );
});

export default ReferralCard;

import React, { memo, useMemo } from 'react';

interface ReferralCardProps {
  title?: string;
  content?: string;
}

const ReferralCard: React.FC<ReferralCardProps> = memo(({ title, content }) => {
  const safeTitle = useMemo(() => title || 'Referral Card', [title]);
  const safeContent = useMemo(() => content || 'No content provided.', [content]);

  return (
    <div className="referral-card" aria-label="Referral Card">
      <h2 className="referral-card__title" aria-label="Card Title">
        {safeTitle}
      </h2>
      <p className="referral-card__content" aria-label="Card Content">
        {safeContent}
      </p>
    </div>
  );
});

export default ReferralCard;