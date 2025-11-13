import React, { FC, useRef, useState, useEffect } from 'react';

interface Props {
  message: string;
  referralCode?: string; // Add optional referralCode prop
}

const ReferralMessage: FC<Props> = ({ message, referralCode }) => {
  const referralMessageRef = useRef<HTMLDivElement>(null); // Add a ref for accessibility
  const [copySuccess, setCopySuccess] = useState(false); // Add state for copy success
  const [copyError, setCopyError] = useState(false); // Add state for copy error

  useEffect(() => {
    if (!navigator.clipboard) {
      setCopyError(true);
    }
  }, []); // Initialize copyError state on component mount

  const handleCopy = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 3000); // Hide success message after 3 seconds
        })
        .catch(() => {
          setCopyError(true);
          setTimeout(() => setCopyError(false), 3000); // Hide error message after 3 seconds
        });
    }
  };

  return (
    <div>
      {/* Add a unique ID for accessibility and tracking purposes */}
      <div id="referral-message" ref={referralMessageRef}>
        {message}
        {referralCode && (
          <>
            <br />
            <small>
              {copySuccess ? (
                <>
                  Copied! <i onClick={handleCopy}>Copy again</i>
                </>
              ) : (
                <>
                  Referral code: {referralCode} <i onClick={handleCopy}>Copy</i>
                </>
              )}
              {copyError && <span style={{ color: 'red' }}>Failed to copy referral code. Please try again.</span>}
            </small>
          </>
        )}
      </div>
      {/* Add a link for users to share their unique referral code */}
      <a href="#" className="referral-link">
        Share your referral code
      </a>
    </div>
  );
};

export default ReferralMessage;

import React, { FC, useRef, useState, useEffect } from 'react';

interface Props {
  message: string;
  referralCode?: string; // Add optional referralCode prop
}

const ReferralMessage: FC<Props> = ({ message, referralCode }) => {
  const referralMessageRef = useRef<HTMLDivElement>(null); // Add a ref for accessibility
  const [copySuccess, setCopySuccess] = useState(false); // Add state for copy success
  const [copyError, setCopyError] = useState(false); // Add state for copy error

  useEffect(() => {
    if (!navigator.clipboard) {
      setCopyError(true);
    }
  }, []); // Initialize copyError state on component mount

  const handleCopy = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 3000); // Hide success message after 3 seconds
        })
        .catch(() => {
          setCopyError(true);
          setTimeout(() => setCopyError(false), 3000); // Hide error message after 3 seconds
        });
    }
  };

  return (
    <div>
      {/* Add a unique ID for accessibility and tracking purposes */}
      <div id="referral-message" ref={referralMessageRef}>
        {message}
        {referralCode && (
          <>
            <br />
            <small>
              {copySuccess ? (
                <>
                  Copied! <i onClick={handleCopy}>Copy again</i>
                </>
              ) : (
                <>
                  Referral code: {referralCode} <i onClick={handleCopy}>Copy</i>
                </>
              )}
              {copyError && <span style={{ color: 'red' }}>Failed to copy referral code. Please try again.</span>}
            </small>
          </>
        )}
      </div>
      {/* Add a link for users to share their unique referral code */}
      <a href="#" className="referral-link">
        Share your referral code
      </a>
    </div>
  );
};

export default ReferralMessage;