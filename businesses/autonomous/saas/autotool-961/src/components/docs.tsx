// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';

interface DocsProps {
  contentSource: string; // URL or path to the documentation content
}

/**
 * Docs Component: Fetches and displays documentation content.
 *
 * @param {DocsProps} props - The component's props.
 * @param {string} props.contentSource - The URL or path to the documentation content.
 * @returns {JSX.Element} - The rendered Docs component.
 *
 * @example
 * <Docs contentSource="/api/docs/latest" />
 */
const Docs: React.FC<DocsProps> = ({ contentSource }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(contentSource);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText}`);
        }

        const data = await response.text();
        setContent(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while fetching documentation.');
        setLoading(false);
      }
    };

    fetchDocs();
  }, [contentSource]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error}
        <details>
          <summary>Troubleshooting</summary>
          <ul>
            <li>Check the `contentSource` prop.</li>
            <li>Verify the documentation server is running.</li>
            <li>Inspect the network request in your browser's developer tools.</li>
          </ul>
        </details>
      </div>
    );
  }

  return (
    <div className="docs-container">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect } from 'react';

interface DocsProps {
  contentSource: string; // URL or path to the documentation content
}

/**
 * Docs Component: Fetches and displays documentation content.
 *
 * @param {DocsProps} props - The component's props.
 * @param {string} props.contentSource - The URL or path to the documentation content.
 * @returns {JSX.Element} - The rendered Docs component.
 *
 * @example
 * <Docs contentSource="/api/docs/latest" />
 */
const Docs: React.FC<DocsProps> = ({ contentSource }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setLoading(true);
        const response = await fetch(contentSource);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status} ${response.statusText}`);
        }

        const data = await response.text();
        setContent(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while fetching documentation.');
        setLoading(false);
      }
    };

    fetchDocs();
  }, [contentSource]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error}
        <details>
          <summary>Troubleshooting</summary>
          <ul>
            <li>Check the `contentSource` prop.</li>
            <li>Verify the documentation server is running.</li>
            <li>Inspect the network request in your browser's developer tools.</li>
          </ul>
        </details>
      </div>
    );
  }

  return (
    <div className="docs-container">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default Docs;