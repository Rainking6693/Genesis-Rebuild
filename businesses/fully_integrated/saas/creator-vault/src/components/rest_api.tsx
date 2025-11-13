import React, { PropsWithChildren, ReactNode } from 'react';
import { useQuery } from 'react-query';

// Add type definitions for useFetch and FetchMessageResponse
type UseFetch<T> = (url: string) => { data: T | null, isLoading: boolean, error: Error | null };
interface FetchMessageResponse {
  success: boolean;
  message: string | null;
  error: Error | null;
}

// useCreatorVaultBoxMessage custom hook
const useCreatorVaultBoxMessage = (vaultId: string) => {
  const fetchMessage = async () => {
    const response = await fetch(`/api/creator-vaults/${vaultId}/message`);
    const data = await response.json();
    return data;
  };

  const { data, isLoading, error, isError } = useQuery<FetchMessageResponse, Error>(
    ['creatorVaultMessage', vaultId],
    fetchMessage,
    {
      refetchOnWindowFocus: false,
      enabled: !!vaultId,
    }
  );

  const message = data?.message || 'Loading...';
  const dataReady = !isLoading && !isError && data?.success;

  return { message, isLoading, error, dataReady };
};

// CreatorVaultBoxMessage component
import React, { PropsWithChildren, ReactNode } from 'react';
import { useCreatorVaultBoxMessage } from './useCreatorVaultBoxMessage';

interface Props {
  vaultId: string;
  loadingSpinnerClassName?: string;
}

const CreatorVaultBoxMessage: React.FC<Props> = ({ vaultId, loadingSpinnerClassName }) => {
  const { message, isLoading, error, dataReady } = useCreatorVaultBoxMessage(vaultId);

  if (isLoading) {
    return (
      <div className="creator-vault-box-message">
        <span className={loadingSpinnerClassName}>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="creator-vault-box-message">
        <span>Error: {error.message}</span>
      </div>
    );
  }

  if (!dataReady) {
    return (
      <div className="creator-vault-box-message">
        <span>No message available for this vault.</span>
      </div>
    );
  }

  return (
    <div className="creator-vault-box-message">
      {message}
    </div>
  );
};

export default CreatorVaultBoxMessage;

import React, { PropsWithChildren, ReactNode } from 'react';
import { useQuery } from 'react-query';

// Add type definitions for useFetch and FetchMessageResponse
type UseFetch<T> = (url: string) => { data: T | null, isLoading: boolean, error: Error | null };
interface FetchMessageResponse {
  success: boolean;
  message: string | null;
  error: Error | null;
}

// useCreatorVaultBoxMessage custom hook
const useCreatorVaultBoxMessage = (vaultId: string) => {
  const fetchMessage = async () => {
    const response = await fetch(`/api/creator-vaults/${vaultId}/message`);
    const data = await response.json();
    return data;
  };

  const { data, isLoading, error, isError } = useQuery<FetchMessageResponse, Error>(
    ['creatorVaultMessage', vaultId],
    fetchMessage,
    {
      refetchOnWindowFocus: false,
      enabled: !!vaultId,
    }
  );

  const message = data?.message || 'Loading...';
  const dataReady = !isLoading && !isError && data?.success;

  return { message, isLoading, error, dataReady };
};

// CreatorVaultBoxMessage component
import React, { PropsWithChildren, ReactNode } from 'react';
import { useCreatorVaultBoxMessage } from './useCreatorVaultBoxMessage';

interface Props {
  vaultId: string;
  loadingSpinnerClassName?: string;
}

const CreatorVaultBoxMessage: React.FC<Props> = ({ vaultId, loadingSpinnerClassName }) => {
  const { message, isLoading, error, dataReady } = useCreatorVaultBoxMessage(vaultId);

  if (isLoading) {
    return (
      <div className="creator-vault-box-message">
        <span className={loadingSpinnerClassName}>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="creator-vault-box-message">
        <span>Error: {error.message}</span>
      </div>
    );
  }

  if (!dataReady) {
    return (
      <div className="creator-vault-box-message">
        <span>No message available for this vault.</span>
      </div>
    );
  }

  return (
    <div className="creator-vault-box-message">
      {message}
    </div>
  );
};

export default CreatorVaultBoxMessage;