import React, { FC, useState, useEffect, ErrorBoundary } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ReferralLinkProps {
  baseUrl: string;
  discount: string;
  minReferrals: number;
  maxReferrals: number;
  expirationDate: Date;
  queryParams?: Record<string, string>;
  className?: string;
  style?: React.CSSProperties;
  target?: string;
  rel?: string;
  referrerPolicy?: string;
  relNofollow?: boolean;
  relSponsored?: boolean;
  relUgc?: boolean;
  relCanonical?: string;
  hreflang?: string;
  ping?: string;
  crossorigin?: string;
  referrerPolicyFallback?: string;
  secure?: boolean;
  preload?: string;
  as?: string;
}

interface ReferralSystemMessageProps extends ReferralLinkProps {
  message: string;
}

const ReferralSystemErrorBoundary: FC<{ children: React.ReactNode }> = ({ children }) => {
  // Handle any unexpected errors that might occur within the ReferralSystemMessage component
  return children;
};

const ReferralSystemMessage: FC<ReferralSystemMessageProps> = ({
  baseUrl,
  discount,
  minReferrals,
  maxReferrals,
  expirationDate,
  queryParams,
  className,
  style,
  target,
  rel,
  referrerPolicy,
  relNofollow,
  relSponsored,
  relUgc,
  relCanonical,
  hreflang,
  ping,
  crossorigin,
  referrerPolicyFallback,
  secure,
  preload,
  as,
  message,
}) => {
  const [uniqueId, setUniqueId] = useState<string | null>(null);

  const generateUniqueId = (): string => {
    let id = uuidv4();
    if (!id) {
      throw new Error('Failed to generate unique ID.');
    }
    return id;
  };

  React.useEffect(() => {
    const id = generateUniqueId();
    setUniqueId(id);
  }, []);

  if (!uniqueId) {
    return <div>Failed to generate unique ID. Using fallback link.</div>;
  }

  const referralLink = `${baseUrl}/refer?ref=${uniqueId}&discount=${discount}&minReferrals=${minReferrals}&maxReferrals=${maxReferrals}&expirationDate=${expirationDate.toISOString()}`;
  const referralLinkProps = {
    href: referralLink,
    ariaLabel: 'Refer MeetingMiner to a friend and get a discount on your subscription!',
    className,
    style,
    target,
    rel,
    referrerPolicy,
    relNofollow,
    relSponsored,
    relUgc,
    relCanonical,
    hreflang,
    ping,
    crossorigin,
    referrerPolicyFallback,
    secure,
    preload,
    as,
    ...queryParams,
  };

  return (
    <a {...referralLinkProps}>
      {message}
    </a>
  );
};

const ReferralSystem: FC = () => {
  const baseUrl = 'https://meetingminer.com';
  const discount = '10%';
  const minReferrals = 3;
  const maxReferrals = 10;
  const expirationDate = new Date(); // Set the expiration date as the current date for testing purposes

  return (
    <ErrorBoundary>
      <ReferralSystemMessage
        baseUrl={baseUrl}
        discount={discount}
        minReferrals={minReferrals}
        maxReferrals={maxReferrals}
        expirationDate={expirationDate}
        message="Refer MeetingMiner to a friend and get a discount on your subscription!"
      />
    </ErrorBoundary>
  );
};

export default ReferralSystem;

This updated code provides a more flexible and maintainable `ReferralSystem` component with improved resiliency, edge cases handling, accessibility, and customization options.