// src/components/Documentation.tsx
import React, { useState, useEffect } from 'react';

interface DocumentationProps {
  contentSource: string; // URL or path to the documentation content
}

const Documentation: React.FC<DocumentationProps> = ({ contentSource }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentation = async () => {
      try {
        setLoading(true);
        const response = await fetch(contentSource);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentation();
  }, [contentSource]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error loading documentation: {error}</div>;
  }

  return (
    <div className="documentation">
      {/* Add search functionality here */}
      {/* Add table of contents here */}
      <div dangerouslySetInnerHTML={{ __html: content || '' }} />
    </div>
  );
};

export default Documentation;

// src/components/Documentation.tsx
import React, { useState, useEffect } from 'react';

interface DocumentationProps {
  contentSource: string; // URL or path to the documentation content
}

const Documentation: React.FC<DocumentationProps> = ({ contentSource }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentation = async () => {
      try {
        setLoading(true);
        const response = await fetch(contentSource);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentation();
  }, [contentSource]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error loading documentation: {error}</div>;
  }

  return (
    <div className="documentation">
      {/* Add search functionality here */}
      {/* Add table of contents here */}
      <div dangerouslySetInnerHTML={{ __html: content || '' }} />
    </div>
  );
};

export default Documentation;