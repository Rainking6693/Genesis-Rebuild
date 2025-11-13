import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ReferralData {
  referralCode: string;
  referralLink: string;
  referralCount: number;
}

interface ReferralSystemProps {
  apiUrl: string;
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({ apiUrl }) => {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(false);

  const fetchReferralData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data: ReferralData = await response.json();
      if (isMounted.current) {
        setReferralData(data);
      }
    } catch (err) {
      console.error('Error fetching referral data:', err);
      if (isMounted.current) {
        setError('Failed to load referral information. Please try again later.');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [apiUrl]);

  useEffect(() => {
    isMounted.current = true;
    fetchReferralData();

    return () => {
      isMounted.current = false;
    };
  }, [fetchReferralData]);

  const handleCopyReferralLink = useCallback(() => {
    if (referralData) {
      navigator.clipboard.writeText(referralData.referralLink)
        .then(() => {
          alert('Referral link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy referral link: ', err);
          alert('Failed to copy referral link. Please try again.');
        });
    }
  }, [referralData]);

  if (isLoading) {
    return <div>Loading referral information...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchReferralData}>Retry</button>
      </div>
    );
  }

  if (!referralData) {
    return <div>No referral data available.</div>;
  }

  return (
    <div>
      <h2>Refer a Friend and Earn Rewards!</h2>
      <p>Share your unique referral link with friends and colleagues. When they sign up, you both benefit!</p>

      <div>
        <h3>Your Referral Link:</h3>
        <p>
          <a href={referralData.referralLink} target="_blank" rel="noopener noreferrer">
            {referralData.referralLink}
          </a>
        </p>
        <button onClick={handleCopyReferralLink}>Copy Referral Link</button>
      </div>

      <div>
        <h3>Your Referral Code:</h3>
        <p>{referralData.referralCode}</p>
      </div>

      <div>
        <p>You have referred {referralData.referralCount} people.</p>
      </div>

      <div>
        <h3>How it Works:</h3>
        <ul>
          <li>Share your referral link or code with friends.</li>
          <li>When they sign up using your link or code, they get a discount.</li>
          <li>You earn rewards for each successful referral.</li>
        </ul>
      </div>
    </div>
  );
};

export default ReferralSystem;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ReferralData {
  referralCode: string;
  referralLink: string;
  referralCount: number;
}

interface ReferralSystemProps {
  apiUrl: string;
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({ apiUrl }) => {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(false);

  const fetchReferralData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data: ReferralData = await response.json();
      if (isMounted.current) {
        setReferralData(data);
      }
    } catch (err) {
      console.error('Error fetching referral data:', err);
      if (isMounted.current) {
        setError('Failed to load referral information. Please try again later.');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [apiUrl]);

  useEffect(() => {
    isMounted.current = true;
    fetchReferralData();

    return () => {
      isMounted.current = false;
    };
  }, [fetchReferralData]);

  const handleCopyReferralLink = useCallback(() => {
    if (referralData) {
      navigator.clipboard.writeText(referralData.referralLink)
        .then(() => {
          alert('Referral link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy referral link: ', err);
          alert('Failed to copy referral link. Please try again.');
        });
    }
  }, [referralData]);

  if (isLoading) {
    return <div>Loading referral information...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchReferralData}>Retry</button>
      </div>
    );
  }

  if (!referralData) {
    return <div>No referral data available.</div>;
  }

  return (
    <div>
      <h2>Refer a Friend and Earn Rewards!</h2>
      <p>Share your unique referral link with friends and colleagues. When they sign up, you both benefit!</p>

      <div>
        <h3>Your Referral Link:</h3>
        <p>
          <a href={referralData.referralLink} target="_blank" rel="noopener noreferrer">
            {referralData.referralLink}
          </a>
        </p>
        <button onClick={handleCopyReferralLink}>Copy Referral Link</button>
      </div>

      <div>
        <h3>Your Referral Code:</h3>
        <p>{referralData.referralCode}</p>
      </div>

      <div>
        <p>You have referred {referralData.referralCount} people.</p>
      </div>

      <div>
        <h3>How it Works:</h3>
        <ul>
          <li>Share your referral link or code with friends.</li>
          <li>When they sign up using your link or code, they get a discount.</li>
          <li>You earn rewards for each successful referral.</li>
        </ul>
      </div>
    </div>
  );
};

export default ReferralSystem;