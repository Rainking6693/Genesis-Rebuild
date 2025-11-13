// src/components/SeoOptimizer.tsx

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

interface SeoOptimizerProps {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
}

const SeoOptimizer: React.FC<SeoOptimizerProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
}) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!title || !description || !keywords || !canonicalUrl) {
      setError('SEO parameters are missing.');
    }
  }, [title, description, keywords, canonicalUrl]);

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error} - Please provide all SEO parameters.
      </div>
    );
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />
      {/* Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default SeoOptimizer;

// Example usage in a page component:

import React from 'react';
import SeoOptimizer from './components/SeoOptimizer';

const HomePage: React.FC = () => {
  const seoData = {
    title: 'My Awesome Blog - Home',
    description: 'Welcome to my blog! Read about the latest trends.',
    keywords: ['blog', 'technology', 'news'],
    canonicalUrl: 'https://www.example.com',
  };

  return (
    <>
      <SeoOptimizer {...seoData} />
      <h1>Welcome to My Blog</h1>
      <p>This is the home page of my blog.</p>
    </>
  );
};

export default HomePage;

// src/components/SeoOptimizer.tsx

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

interface SeoOptimizerProps {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
}

const SeoOptimizer: React.FC<SeoOptimizerProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
}) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!title || !description || !keywords || !canonicalUrl) {
      setError('SEO parameters are missing.');
    }
  }, [title, description, keywords, canonicalUrl]);

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error} - Please provide all SEO parameters.
      </div>
    );
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />
      {/* Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default SeoOptimizer;

// Example usage in a page component:

import React from 'react';
import SeoOptimizer from './components/SeoOptimizer';

const HomePage: React.FC = () => {
  const seoData = {
    title: 'My Awesome Blog - Home',
    description: 'Welcome to my blog! Read about the latest trends.',
    keywords: ['blog', 'technology', 'news'],
    canonicalUrl: 'https://www.example.com',
  };

  return (
    <>
      <SeoOptimizer {...seoData} />
      <h1>Welcome to My Blog</h1>
      <p>This is the home page of my blog.</p>
    </>
  );
};

export default HomePage;