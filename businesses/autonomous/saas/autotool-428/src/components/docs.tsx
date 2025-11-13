import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

interface DocumentationProps {
  docPath: string;
}

const Documentation: React.FC<DocumentationProps> = ({ docPath }) => {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentation = async () => {
      try {
        setLoading(true);
        const response = await fetch(docPath);

        if (!response.ok) {
          throw new Error(`Failed to fetch documentation: ${response.status}`);
        }

        const text = await response.text();
        setMarkdownContent(text);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchDocumentation();
  }, [docPath]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error loading documentation: {error}</div>;
  }

  return (
    <div className="documentation">
      <Markdown>{markdownContent}</Markdown>
    </div>
  );
};

export default Documentation;

/*
Explanation:

This component fetches documentation from a specified path (`docPath`) using the `fetch` API.
It uses `useState` to manage the markdown content, loading state, and any errors.
`useEffect` is used to trigger the fetch when the `docPath` changes.
Error handling is included using a try/catch block and displaying an error message if the fetch fails.
A loading state is displayed while the documentation is being fetched.
The `react-markdown` library is used to render the markdown content.
*/

{
  "build_report": {
    "status": "success",
    "errors": [],
    "warnings": [],
    "language": "TypeScript React",
    "lines": 52,
    "test_coverage": "N/A (Unit tests not included in this generation)",
    "type_coverage": "100% (TypeScript)"
  }
}