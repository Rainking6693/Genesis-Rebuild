import React, { useState, useCallback, useEffect } from 'react';

interface ReferralSystemProps {
  referralCode?: string;
  discountPercentage?: number;
  requiredReferrals?: number;
  onDiscountApplied?: () => void;
  onError?: (message: string) => void;
  storageKey?: string; // Allows customization of the localStorage key
}

const defaultStorageKey = 'referralCount';

const ReferralSystem: React.FC<ReferralSystemProps> = ({
  referralCode,
  discountPercentage = 5,
  requiredReferrals = 3,
  onDiscountApplied,
  onError,
  storageKey = defaultStorageKey,
}) => {
  const [referralCount, setReferralCount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Function to handle errors and display messages
  const handleError = useCallback((message: string) => {
    console.error(message);
    setErrorMessage(message); // Set error message for display
    onError?.(message); // Call the provided error callback
  }, [onError]);

  // Load referral count from localStorage on component mount
  useEffect(() => {
    try {
      const storedCount = localStorage.getItem(storageKey);
      if (storedCount) {
        const parsedCount = parseInt(storedCount, 10);
        if (!isNaN(parsedCount)) {
          setReferralCount(parsedCount);
        } else {
          handleError("Invalid referral count stored in localStorage.");
        }
      }
    } catch (error: any) {
      console.error("Error loading referral count from localStorage:", error);
      handleError("Failed to load referral data.");
    }
  }, [storageKey, handleError]);

  // Save referral count to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, referralCount.toString());
    } catch (error: any) {
      console.error("Error saving referral count to localStorage:", error);
      handleError("Failed to save referral data.");
    }
  }, [referralCount, storageKey, handleError]);

  const incrementReferralCount = useCallback(() => {
    setReferralCount((prevCount) => prevCount + 1);
  }, []);

  const applyDiscount = useCallback(() => {
    if (isLoading) return;

    if (referralCount >= requiredReferrals && !discountApplied) {
      setIsLoading(true);
      setErrorMessage(null); // Clear any previous error messages

      try {
        // Simulate an asynchronous operation (e.g., API call)
        setTimeout(() => {
          console.log(`Applying discount of ${discountPercentage}%`);
          setDiscountApplied(true);
          onDiscountApplied?.();
          setIsLoading(false);
        }, 500);

      } catch (error: any) {
        console.error("Failed to apply discount:", error);
        handleError("Failed to apply discount. Please try again.");
        setIsLoading(false);
      }
    } else if (discountApplied) {
      setErrorMessage("Discount already applied."); // Display as error message
    } else {
      const remainingReferrals = requiredReferrals - referralCount;
      setErrorMessage(`Refer ${remainingReferrals} more friend${remainingReferrals === 1 ? '' : 's'} to unlock a discount!`);
    }
  }, [discountApplied, discountPercentage, referralCount, requiredReferrals, onDiscountApplied, handleError, isLoading]);

  const referralCodeDisplay = referralCode ? (
    <p aria-live="polite">
      Your Referral Code: <strong aria-label={`Referral code is ${referralCode}`}>{referralCode}</strong>
    </p>
  ) : (
    <p>No referral code available.</p>
  );

  return (
    <div aria-label="Referral System">
      <h3>Referral System</h3>
      {referralCodeDisplay}
      <p>Referrals: {referralCount}</p>
      <button onClick={incrementReferralCount} aria-label="Simulate adding a referral">
        Simulate Referral
      </button>
      <button
        onClick={applyDiscount}
        disabled={discountApplied || referralCount < requiredReferrals || isLoading}
        aria-label={
          discountApplied
            ? "Discount already applied"
            : referralCount < requiredReferrals
            ? `Requires ${requiredReferrals - referralCount} more referrals to apply discount`
            : "Apply discount"
        }
      >
        {isLoading ? "Applying..." : discountApplied ? "Discount Applied" : "Apply Discount"}
      </button>
      {discountApplied && (
        <p aria-live="polite">Discount of {discountPercentage}% has been applied.</p>
      )}
      {errorMessage && (
        <div role="alert" style={{ color: 'red' }}>{errorMessage}</div>
      )}
    </div>
  );
};

export default ReferralSystem;

import React, { useState, useCallback, useEffect } from 'react';

interface ReferralSystemProps {
  referralCode?: string;
  discountPercentage?: number;
  requiredReferrals?: number;
  onDiscountApplied?: () => void;
  onError?: (message: string) => void;
  storageKey?: string; // Allows customization of the localStorage key
}

const defaultStorageKey = 'referralCount';

const ReferralSystem: React.FC<ReferralSystemProps> = ({
  referralCode,
  discountPercentage = 5,
  requiredReferrals = 3,
  onDiscountApplied,
  onError,
  storageKey = defaultStorageKey,
}) => {
  const [referralCount, setReferralCount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Function to handle errors and display messages
  const handleError = useCallback((message: string) => {
    console.error(message);
    setErrorMessage(message); // Set error message for display
    onError?.(message); // Call the provided error callback
  }, [onError]);

  // Load referral count from localStorage on component mount
  useEffect(() => {
    try {
      const storedCount = localStorage.getItem(storageKey);
      if (storedCount) {
        const parsedCount = parseInt(storedCount, 10);
        if (!isNaN(parsedCount)) {
          setReferralCount(parsedCount);
        } else {
          handleError("Invalid referral count stored in localStorage.");
        }
      }
    } catch (error: any) {
      console.error("Error loading referral count from localStorage:", error);
      handleError("Failed to load referral data.");
    }
  }, [storageKey, handleError]);

  // Save referral count to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, referralCount.toString());
    } catch (error: any) {
      console.error("Error saving referral count to localStorage:", error);
      handleError("Failed to save referral data.");
    }
  }, [referralCount, storageKey, handleError]);

  const incrementReferralCount = useCallback(() => {
    setReferralCount((prevCount) => prevCount + 1);
  }, []);

  const applyDiscount = useCallback(() => {
    if (isLoading) return;

    if (referralCount >= requiredReferrals && !discountApplied) {
      setIsLoading(true);
      setErrorMessage(null); // Clear any previous error messages

      try {
        // Simulate an asynchronous operation (e.g., API call)
        setTimeout(() => {
          console.log(`Applying discount of ${discountPercentage}%`);
          setDiscountApplied(true);
          onDiscountApplied?.();
          setIsLoading(false);
        }, 500);

      } catch (error: any) {
        console.error("Failed to apply discount:", error);
        handleError("Failed to apply discount. Please try again.");
        setIsLoading(false);
      }
    } else if (discountApplied) {
      setErrorMessage("Discount already applied."); // Display as error message
    } else {
      const remainingReferrals = requiredReferrals - referralCount;
      setErrorMessage(`Refer ${remainingReferrals} more friend${remainingReferrals === 1 ? '' : 's'} to unlock a discount!`);
    }
  }, [discountApplied, discountPercentage, referralCount, requiredReferrals, onDiscountApplied, handleError, isLoading]);

  const referralCodeDisplay = referralCode ? (
    <p aria-live="polite">
      Your Referral Code: <strong aria-label={`Referral code is ${referralCode}`}>{referralCode}</strong>
    </p>
  ) : (
    <p>No referral code available.</p>
  );

  return (
    <div aria-label="Referral System">
      <h3>Referral System</h3>
      {referralCodeDisplay}
      <p>Referrals: {referralCount}</p>
      <button onClick={incrementReferralCount} aria-label="Simulate adding a referral">
        Simulate Referral
      </button>
      <button
        onClick={applyDiscount}
        disabled={discountApplied || referralCount < requiredReferrals || isLoading}
        aria-label={
          discountApplied
            ? "Discount already applied"
            : referralCount < requiredReferrals
            ? `Requires ${requiredReferrals - referralCount} more referrals to apply discount`
            : "Apply discount"
        }
      >
        {isLoading ? "Applying..." : discountApplied ? "Discount Applied" : "Apply Discount"}
      </button>
      {discountApplied && (
        <p aria-live="polite">Discount of {discountPercentage}% has been applied.</p>
      )}
      {errorMessage && (
        <div role="alert" style={{ color: 'red' }}>{errorMessage}</div>
      )}
    </div>
  );
};

export default ReferralSystem;