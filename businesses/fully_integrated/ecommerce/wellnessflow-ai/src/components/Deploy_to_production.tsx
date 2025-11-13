import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

interface DeploymentStatus {
  status: 'idle' | 'pending' | 'success' | 'failure';
  message: string | null;
  lastAttempt: Date | null;
}

interface DeployButtonProps {
  environment: string;
  apiEndpoint: string;
  onSuccess?: () => void;
  onFailure?: (error: Error) => void;
  className?: string;
  disabled?: boolean;
  retryDelay?: number; // Delay before retrying a failed deployment
  maxRetries?: number; // Maximum number of retries before giving up
}

const DeployButton: React.FC<DeployButtonProps> = ({
  environment,
  apiEndpoint,
  onSuccess,
  onFailure,
  className = '',
  disabled = false,
  retryDelay = 5000, // 5 seconds
  maxRetries = 3,
}) => {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>({
    status: 'idle',
    message: null,
    lastAttempt: null,
  });
  const [retryCount, setRetryCount] = useState(0);

  const buttonText = useMemo(() => {
    switch (deploymentStatus.status) {
      case 'idle':
        return `Deploy to ${environment}`;
      case 'pending':
        return `Deploying to ${environment}...`;
      case 'success':
        return `Deployed to ${environment}!`;
      case 'failure':
        return `Deployment to ${environment} Failed`;
      default:
        return `Deploy to ${environment}`;
    }
  }, [deploymentStatus.status, environment]);

  const isDeploying = deploymentStatus.status === 'pending';
  const isSuccess = deploymentStatus.status === 'success';
  const isFailure = deploymentStatus.status === 'failure';

  const deploy = useCallback(async () => {
    if (isDeploying || disabled) return;

    setDeploymentStatus({ status: 'pending', message: 'Deployment started...', lastAttempt: new Date() });

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ environment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message || `Deployment failed with status: ${response.status}`;
        throw new Error(errorMessage);
      }

      setDeploymentStatus({ status: 'success', message: 'Deployment successful!', lastAttempt: new Date() });
      onSuccess?.();
    } catch (error: any) {
      console.error('Deployment failed:', error);

      if (retryCount < maxRetries) {
        console.log(`Retrying deployment in ${retryDelay / 1000} seconds...`);
        setRetryCount(retryCount + 1);
        setDeploymentStatus({
          status: 'pending',
          message: `Retrying deployment (attempt ${retryCount + 1}/${maxRetries})...`,
          lastAttempt: new Date(),
        });
        setTimeout(deploy, retryDelay);
      } else {
        setDeploymentStatus({
          status: 'failure',
          message: error.message || 'Deployment failed',
          lastAttempt: new Date(),
        });
        onFailure?.(error);
      }
    }
  }, [apiEndpoint, environment, isDeploying, onSuccess, onFailure, disabled, retryCount, maxRetries, retryDelay]);

  // Reset status after a delay on success or failure
  useEffect(() => {
    if (isSuccess || isFailure) {
      const timer = setTimeout(() => {
        setDeploymentStatus({ status: 'idle', message: null, lastAttempt: deploymentStatus.lastAttempt });
        setRetryCount(0);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isFailure, deploymentStatus.lastAttempt]);

  return (
    <button
      className={`deploy-button ${className} ${isDeploying ? 'deploy-button--pending' : ''} ${isSuccess ? 'deploy-button--success' : ''} ${isFailure ? 'deploy-button--failure' : ''}`}
      onClick={deploy}
      disabled={isDeploying || disabled}
      aria-busy={isDeploying}
      aria-live="polite"
    >
      {buttonText}
    </button>
  );
};

DeployButton.propTypes = {
  environment: PropTypes.string.isRequired,
  apiEndpoint: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  retryDelay: PropTypes.number,
  maxRetries: PropTypes.number,
};

export default DeployButton;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

interface DeploymentStatus {
  status: 'idle' | 'pending' | 'success' | 'failure';
  message: string | null;
  lastAttempt: Date | null;
}

interface DeployButtonProps {
  environment: string;
  apiEndpoint: string;
  onSuccess?: () => void;
  onFailure?: (error: Error) => void;
  className?: string;
  disabled?: boolean;
  retryDelay?: number; // Delay before retrying a failed deployment
  maxRetries?: number; // Maximum number of retries before giving up
}

const DeployButton: React.FC<DeployButtonProps> = ({
  environment,
  apiEndpoint,
  onSuccess,
  onFailure,
  className = '',
  disabled = false,
  retryDelay = 5000, // 5 seconds
  maxRetries = 3,
}) => {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus>({
    status: 'idle',
    message: null,
    lastAttempt: null,
  });
  const [retryCount, setRetryCount] = useState(0);

  const buttonText = useMemo(() => {
    switch (deploymentStatus.status) {
      case 'idle':
        return `Deploy to ${environment}`;
      case 'pending':
        return `Deploying to ${environment}...`;
      case 'success':
        return `Deployed to ${environment}!`;
      case 'failure':
        return `Deployment to ${environment} Failed`;
      default:
        return `Deploy to ${environment}`;
    }
  }, [deploymentStatus.status, environment]);

  const isDeploying = deploymentStatus.status === 'pending';
  const isSuccess = deploymentStatus.status === 'success';
  const isFailure = deploymentStatus.status === 'failure';

  const deploy = useCallback(async () => {
    if (isDeploying || disabled) return;

    setDeploymentStatus({ status: 'pending', message: 'Deployment started...', lastAttempt: new Date() });

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ environment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message || `Deployment failed with status: ${response.status}`;
        throw new Error(errorMessage);
      }

      setDeploymentStatus({ status: 'success', message: 'Deployment successful!', lastAttempt: new Date() });
      onSuccess?.();
    } catch (error: any) {
      console.error('Deployment failed:', error);

      if (retryCount < maxRetries) {
        console.log(`Retrying deployment in ${retryDelay / 1000} seconds...`);
        setRetryCount(retryCount + 1);
        setDeploymentStatus({
          status: 'pending',
          message: `Retrying deployment (attempt ${retryCount + 1}/${maxRetries})...`,
          lastAttempt: new Date(),
        });
        setTimeout(deploy, retryDelay);
      } else {
        setDeploymentStatus({
          status: 'failure',
          message: error.message || 'Deployment failed',
          lastAttempt: new Date(),
        });
        onFailure?.(error);
      }
    }
  }, [apiEndpoint, environment, isDeploying, onSuccess, onFailure, disabled, retryCount, maxRetries, retryDelay]);

  // Reset status after a delay on success or failure
  useEffect(() => {
    if (isSuccess || isFailure) {
      const timer = setTimeout(() => {
        setDeploymentStatus({ status: 'idle', message: null, lastAttempt: deploymentStatus.lastAttempt });
        setRetryCount(0);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isFailure, deploymentStatus.lastAttempt]);

  return (
    <button
      className={`deploy-button ${className} ${isDeploying ? 'deploy-button--pending' : ''} ${isSuccess ? 'deploy-button--success' : ''} ${isFailure ? 'deploy-button--failure' : ''}`}
      onClick={deploy}
      disabled={isDeploying || disabled}
      aria-busy={isDeploying}
      aria-live="polite"
    >
      {buttonText}
    </button>
  );
};

DeployButton.propTypes = {
  environment: PropTypes.string.isRequired,
  apiEndpoint: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  retryDelay: PropTypes.number,
  maxRetries: PropTypes.number,
};

export default DeployButton;