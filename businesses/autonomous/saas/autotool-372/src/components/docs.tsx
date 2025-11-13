// src/components/DocsPage.tsx
import React, { useState, useEffect } from 'react';

interface DocsPageProps {
  contentUrl: string;
}

const DocsPage: React.FC<DocsPageProps> = ({ contentUrl }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(contentUrl);

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

    fetchContent();
  }, [contentUrl]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error loading documentation: {error}</div>;
  }

  return (
    <div className="docs-page">
      <div className="docs-content" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default DocsPage;

// src/components/DocsNavigation.tsx
import React from 'react';

interface DocsNavigationProps {
  sections: { title: string; link: string }[];
}

const DocsNavigation: React.FC<DocsNavigationProps> = ({ sections }) => {
  return (
    <nav className="docs-navigation">
      <ul>
        {sections.map((section) => (
          <li key={section.link}>
            <a href={section.link}>{section.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DocsNavigation;

// src/components/DocsSearch.tsx
import React, { useState } from 'react';

interface DocsSearchProps {
  onSearch: (query: string) => void;
}

const DocsSearch: React.FC<DocsSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="docs-search">
      <input
        type="text"
        placeholder="Search documentation..."
        value={query}
        onChange={handleChange}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default DocsSearch;

// src/components/DocsPage.tsx
import React, { useState, useEffect } from 'react';

interface DocsPageProps {
  contentUrl: string;
}

const DocsPage: React.FC<DocsPageProps> = ({ contentUrl }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(contentUrl);

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

    fetchContent();
  }, [contentUrl]);

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error loading documentation: {error}</div>;
  }

  return (
    <div className="docs-page">
      <div className="docs-content" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default DocsPage;

// src/components/DocsNavigation.tsx
import React from 'react';

interface DocsNavigationProps {
  sections: { title: string; link: string }[];
}

const DocsNavigation: React.FC<DocsNavigationProps> = ({ sections }) => {
  return (
    <nav className="docs-navigation">
      <ul>
        {sections.map((section) => (
          <li key={section.link}>
            <a href={section.link}>{section.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DocsNavigation;

// src/components/DocsSearch.tsx
import React, { useState } from 'react';

interface DocsSearchProps {
  onSearch: (query: string) => void;
}

const DocsSearch: React.FC<DocsSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="docs-search">
      <input
        type="text"
        placeholder="Search documentation..."
        value={query}
        onChange={handleChange}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default DocsSearch;