import React, { useState, useEffect } from 'react';

interface Props {
  policyId: string; // Unique identifier for the policy
  onPolicyUpdate: (updatedPolicy: string | null) => void; // Updated policy or null if an error occurs
}

const UsageAnalytics: React.FC<Props> = ({ policyId, onPolicyUpdate }) => {
  const [policy, setPolicy] = useState<string>(''); // State to store the policy
  const [error, setError] = useState<Error | null>(null); // State to store any errors that occur

  const fetchPolicy = async () => {
    try {
      const response = await fetch(`/api/policies/${policyId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch policy with status ${response.status}`);
      }
      const data = await response.json();
      setPolicy(data.policy);
      setError(null);
    } catch (error) {
      setError(error);
    }
  };

  const updatePolicy = async (newPolicy: string) => {
    try {
      const response = await fetch(`/api/policies/${policyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policy: newPolicy }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update policy with status ${response.status}`);
      }

      const data = await response.json();
      setPolicy(data.policy);
      onPolicyUpdate(data.policy);
      setError(null);
    } catch (error) {
      setError(error);
      onPolicyUpdate(null);
    }
  };

  const handleClick = () => {
    if (!policy) {
      setError(new Error('Policy cannot be empty'));
      return;
    }
    updatePolicy(policy);
  };

  useEffect(() => {
    fetchPolicy();
  }, [policyId]); // Fetch policy on component mount and when policyId changes

  return (
    <div>
      <h2>Usage Analytics for Policy ID: {policyId}</h2>
      {error && <p>Error: {error.message}</p>}
      <textarea value={policy} onChange={(e) => setPolicy(e.target.value)} aria-describedby="error" />
      <button onClick={handleClick} disabled={!policy}>Update Policy</button>
      {error && <p id="error" role="alert">An error occurred while updating the policy.</p>}
    </div>
  );
};

export default UsageAnalytics;

Changes made:

1. Added a check to prevent updating the policy if the policy text is empty.
2. Added a `disabled` attribute to the update button to prevent it from being clicked when the policy text is empty.
3. Improved error handling by providing more descriptive error messages.
4. Added accessibility improvements by providing an `aria-describedby` attribute to the textarea.
5. Improved maintainability by adding comments to explain the purpose of the code.