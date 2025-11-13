// src/components/Docs.tsx
import React, { useState, useEffect, Suspense } from 'react';
import { searchDocs } from '../api/docsService'; // Assuming an API service for fetching docs
import ErrorBoundary from './ErrorBoundary'; // Reusable error boundary component
import LoadingSpinner from './LoadingSpinner'; // Reusable loading spinner

interface Doc {
  id: string;
  title: string;
  content: string;
}

const Docs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Doc[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Clear any previous errors
      try {
        const results = await searchDocs(searchTerm);
        setSearchResults(results);
      } catch (err: any) { // Explicitly type 'err' as 'any' to avoid TS2571
        console.error("Error fetching documentation:", err);
        setError(new Error("Failed to load documentation. Please try again later."));
      } finally {
        setIsLoading(false);
      }
    };

    if (searchTerm) {
      fetchData();
    } else {
      setSearchResults([]); // Clear results when search term is empty
    }
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <ErrorBoundary>
      <div>
        <h1>Documentation</h1>
        <input
          type="text"
          placeholder="Search documentation..."
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {isLoading && <LoadingSpinner />}

        {error && (
          <div style={{ color: 'red' }}>
            Error: {error.message}
          </div>
        )}

        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((doc) => (
              <li key={doc.id}>
                <h2>{doc.title}</h2>
                <p>{doc.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          searchTerm && !isLoading && !error && <p>No results found.</p>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Docs;

// src/components/ErrorBoundary.tsx
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught an error in ErrorBoundary:", error, errorInfo);
    this.setState({errorInfo: errorInfo})
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Something went wrong.</h2>
          <p>Error: {this.state.error?.message}</p>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.errorInfo?.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// src/components/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      Loading...
    </div>
  );
};

export default LoadingSpinner;

// src/api/docsService.ts
// Mock implementation for demonstration purposes
export const searchDocs = async (searchTerm: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockData = [
        { id: '1', title: 'Getting Started', content: 'This is the getting started guide.' },
        { id: '2', title: 'API Reference', content: 'This is the API reference.' },
        { id: '3', title: 'Troubleshooting', content: 'This is the troubleshooting guide.' },
      ];

      const filteredData = mockData.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (Math.random() < 0.2) { // Simulate a 20% chance of failure
        reject(new Error("Failed to fetch documentation from the server."));
      } else {
        resolve(filteredData);
      }
    }, 500); // Simulate a network request delay
  });
};