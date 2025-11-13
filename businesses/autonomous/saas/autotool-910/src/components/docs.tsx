// src/components/Docs.tsx
import React, { useState, useEffect, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Article {
  title: string;
  content: string;
  id: string;
}

const articles: Article[] = [
  { id: '1', title: 'Getting Started', content: 'This is the getting started guide.' },
  { id: '2', title: 'API Reference', content: 'This is the API reference.' },
  { id: '3', title: 'FAQ', content: 'Frequently asked questions.' },
];

function ArticleContent({ articleId }: { articleId: string }) {
  const article = articles.find((a) => a.id === articleId);

  if (!article) {
    return <div>Article not found.</div>;
  }

  return (
    <div>
      <h2>{article.title}</h2>
      <p>{article.content}</p>
    </div>
  );
}

function Docs() {
  const { articleId } = useParams<{ articleId: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>(articles);

  useEffect(() => {
    const results = articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="docs-container">
      <h1>Documentation</h1>

      <input
        type="text"
        placeholder="Search documentation..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className="docs-content">
        <div className="sidebar">
          <h2>Table of Contents</h2>
          <ul>
            {searchResults.map((article) => (
              <li key={article.id}>
                <Link to={`/docs/${article.id}`}>{article.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="main-content">
          <Suspense fallback={<div>Loading article...</div>}>
            {articleId ? <ArticleContent articleId={articleId} /> : <div>Please select an article from the table of contents.</div>}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default Docs;

// src/components/Docs.tsx
import React, { useState, useEffect, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Article {
  title: string;
  content: string;
  id: string;
}

const articles: Article[] = [
  { id: '1', title: 'Getting Started', content: 'This is the getting started guide.' },
  { id: '2', title: 'API Reference', content: 'This is the API reference.' },
  { id: '3', title: 'FAQ', content: 'Frequently asked questions.' },
];

function ArticleContent({ articleId }: { articleId: string }) {
  const article = articles.find((a) => a.id === articleId);

  if (!article) {
    return <div>Article not found.</div>;
  }

  return (
    <div>
      <h2>{article.title}</h2>
      <p>{article.content}</p>
    </div>
  );
}

function Docs() {
  const { articleId } = useParams<{ articleId: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>(articles);

  useEffect(() => {
    const results = articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="docs-container">
      <h1>Documentation</h1>

      <input
        type="text"
        placeholder="Search documentation..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className="docs-content">
        <div className="sidebar">
          <h2>Table of Contents</h2>
          <ul>
            {searchResults.map((article) => (
              <li key={article.id}>
                <Link to={`/docs/${article.id}`}>{article.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="main-content">
          <Suspense fallback={<div>Loading article...</div>}>
            {articleId ? <ArticleContent articleId={articleId} /> : <div>Please select an article from the table of contents.</div>}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default Docs;