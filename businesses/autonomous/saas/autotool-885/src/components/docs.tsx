// src/components/Documentation.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

interface DocumentationProps {
  docPath: string;
}

const Documentation: React.FC<DocumentationProps> = ({ docPath }) => {
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentation = async () => {
      setLoading(true);
      try {
        const response = await fetch(docPath);
        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status}`);
        }
        const text = await response.text();
        setMarkdown(text);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching documentation:", err); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentation();
  }, [docPath]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return (
      <div>
        Error loading documentation: {error}
        {/* Consider adding a retry button here */}
      </div>
    );
  }

  return (
    <div className="documentation">
      <Markdown>{markdown}</Markdown>
    </div>
  );
};

export default Documentation;

// src/components/Documentation.tsx
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

interface DocumentationProps {
  docPath: string;
}

const Documentation: React.FC<DocumentationProps> = ({ docPath }) => {
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentation = async () => {
      setLoading(true);
      try {
        const response = await fetch(docPath);
        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status}`);
        }
        const text = await response.text();
        setMarkdown(text);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching documentation:", err); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentation();
  }, [docPath]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return (
      <div>
        Error loading documentation: {error}
        {/* Consider adding a retry button here */}
      </div>
    );
  }

  return (
    <div className="documentation">
      <Markdown>{markdown}</Markdown>
    </div>
  );
};

export default Documentation;

Now, I will generate the build report: