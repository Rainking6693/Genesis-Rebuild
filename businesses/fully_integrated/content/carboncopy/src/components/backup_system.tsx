import React, { useState, useEffect, useCallback } from 'react';

interface ContentProps {
  title?: string | null;
  content?: string | null;
  error?: string | null;
  isLoading?: boolean;
}

const ContentDisplay: React.FC<ContentProps> = ({ title, content, error, isLoading }) => {
  const [ariaLabelTitle, setAriaLabelTitle] = useState<string>('');
  const [ariaLabelContent, setAriaLabelContent] = useState<string>('');
  const [ariaLabelEmpty, setAriaLabelEmpty] = useState<string>('No content available');

  // Update aria labels based on title and content changes
  useEffect(() => {
    if (title) {
      setAriaLabelTitle(`Title: ${title}`);
    } else {
      setAriaLabelTitle('');
    }

    if (content) {
      setAriaLabelContent(`Content: ${content}`);
    } else {
      setAriaLabelContent('');
    }
  }, [title, content]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="content-display content-display--loading" aria-busy="true">
        <p>Loading content...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="content-display content-display--error" role="alert">
        <p>Error: {error}</p>
      </div>
    );
  }

  // Render content
  return (
    <div className="content-display">
      {title && (
        <h1 className="content-display__title" aria-label={ariaLabelTitle}>
          {title}
        </h1>
      )}
      {content && (
        <p className="content-display__content" aria-label={ariaLabelContent}>
          {content}
        </p>
      )}
      {!title && !content && !error && !isLoading && (
        <div className="content-display__empty" aria-label={ariaLabelEmpty}>
          No content available
        </div>
      )}
    </div>
  );
};

interface BackupSystemProps {
  fetchContent: () => Promise<{ title: string | null; content: string | null }>;
  retryInterval?: number; // Time in milliseconds between retries
  maxRetries?: number;
}

const BackupSystem: React.FC<BackupSystemProps> = ({ fetchContent, retryInterval = 5000, maxRetries = 3 }) => {
  const [contentData, setContentData] = useState<{ title: string | null; content: string | null }>({ title: null, content: null });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchContent();
      setContentData({ title: data.title || null, content: data.content || null });
      setIsLoading(false);
      setRetryCount(0); // Reset retry count on success
    } catch (err: any) {
      console.error("Error fetching content:", err);
      setError(err.message || 'Failed to load content.');
      setIsLoading(false);

      if (retryCount < maxRetries) {
        console.log(`Retrying in ${retryInterval / 1000} seconds... (Attempt ${retryCount + 1}/${maxRetries})`);
        setTimeout(() => {
          setRetryCount(prevCount => prevCount + 1);
          loadContent(); // Retry the fetch
        }, retryInterval);
      } else {
        console.error("Max retries reached. Content loading failed.");
      }
    }
  }, [fetchContent, retryCount, maxRetries, retryInterval]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  return (
    <div className="backup-system">
      <ContentDisplay
        title={contentData.title}
        content={contentData.content}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BackupSystem;

import React, { useState, useEffect, useCallback } from 'react';

interface ContentProps {
  title?: string | null;
  content?: string | null;
  error?: string | null;
  isLoading?: boolean;
}

const ContentDisplay: React.FC<ContentProps> = ({ title, content, error, isLoading }) => {
  const [ariaLabelTitle, setAriaLabelTitle] = useState<string>('');
  const [ariaLabelContent, setAriaLabelContent] = useState<string>('');
  const [ariaLabelEmpty, setAriaLabelEmpty] = useState<string>('No content available');

  // Update aria labels based on title and content changes
  useEffect(() => {
    if (title) {
      setAriaLabelTitle(`Title: ${title}`);
    } else {
      setAriaLabelTitle('');
    }

    if (content) {
      setAriaLabelContent(`Content: ${content}`);
    } else {
      setAriaLabelContent('');
    }
  }, [title, content]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="content-display content-display--loading" aria-busy="true">
        <p>Loading content...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="content-display content-display--error" role="alert">
        <p>Error: {error}</p>
      </div>
    );
  }

  // Render content
  return (
    <div className="content-display">
      {title && (
        <h1 className="content-display__title" aria-label={ariaLabelTitle}>
          {title}
        </h1>
      )}
      {content && (
        <p className="content-display__content" aria-label={ariaLabelContent}>
          {content}
        </p>
      )}
      {!title && !content && !error && !isLoading && (
        <div className="content-display__empty" aria-label={ariaLabelEmpty}>
          No content available
        </div>
      )}
    </div>
  );
};

interface BackupSystemProps {
  fetchContent: () => Promise<{ title: string | null; content: string | null }>;
  retryInterval?: number; // Time in milliseconds between retries
  maxRetries?: number;
}

const BackupSystem: React.FC<BackupSystemProps> = ({ fetchContent, retryInterval = 5000, maxRetries = 3 }) => {
  const [contentData, setContentData] = useState<{ title: string | null; content: string | null }>({ title: null, content: null });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchContent();
      setContentData({ title: data.title || null, content: data.content || null });
      setIsLoading(false);
      setRetryCount(0); // Reset retry count on success
    } catch (err: any) {
      console.error("Error fetching content:", err);
      setError(err.message || 'Failed to load content.');
      setIsLoading(false);

      if (retryCount < maxRetries) {
        console.log(`Retrying in ${retryInterval / 1000} seconds... (Attempt ${retryCount + 1}/${maxRetries})`);
        setTimeout(() => {
          setRetryCount(prevCount => prevCount + 1);
          loadContent(); // Retry the fetch
        }, retryInterval);
      } else {
        console.error("Max retries reached. Content loading failed.");
      }
    }
  }, [fetchContent, retryCount, maxRetries, retryInterval]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  return (
    <div className="backup-system">
      <ContentDisplay
        title={contentData.title}
        content={contentData.content}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BackupSystem;