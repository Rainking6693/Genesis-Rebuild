// src/components/DocsComponent.tsx
import React, { useState, useEffect } from 'react';

interface DocSection {
  title: string;
  content: string;
}

/**
 * DocsComponent: A component for displaying documentation for the SaaS product.
 * It fetches and renders different sections of documentation, such as API documentation,
 * user guides, and FAQs.
 */
const DocsComponent = () => {
  const [apiDocs, setApiDocs] = useState<DocSection[]>([]);
  const [userGuides, setUserGuides] = useState<DocSection[]>([]);
  const [faqs, setFaqs] = useState<DocSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching documentation from an API or local files
        const apiDocsData = await fetchApiDocs();
        const userGuidesData = await fetchUserGuides();
        const faqsData = await fetchFaqs();

        setApiDocs(apiDocsData);
        setUserGuides(userGuidesData);
        setFaqs(faqsData);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching documentation:", err);
        setError("Failed to load documentation. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Fetches API documentation.
   * @returns A promise that resolves to an array of DocSection objects.
   */
  const fetchApiDocs = async (): Promise<DocSection[]> => {
    // Simulate fetching API documentation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { title: "Authentication", content: "Details about authentication..." },
          { title: "Endpoints", content: "List of available API endpoints..." },
        ]);
      }, 500);
    });
  };

  /**
   * Fetches user guides.
   * @returns A promise that resolves to an array of DocSection objects.
   */
  const fetchUserGuides = async (): Promise<DocSection[]> => {
    // Simulate fetching user guides
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { title: "Getting Started", content: "A guide to getting started with the SaaS product..." },
          { title: "Advanced Features", content: "Details about advanced features..." },
        ]);
      }, 500);
    });
  };

  /**
   * Fetches FAQs.
   * @returns A promise that resolves to an array of DocSection objects.
   */
  const fetchFaqs = async (): Promise<DocSection[]> => {
    // Simulate fetching FAQs
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { title: "What is the SaaS product?", content: "An explanation of the SaaS product..." },
          { title: "How do I get support?", content: "Information about how to get support..." },
        ]);
      }, 500);
    });
  };

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Documentation</h1>
      <h2>API Documentation</h2>
      {apiDocs.map((section, index) => (
        <div key={index}>
          <h3>{section.title}</h3>
          <p>{section.content}</p>
        </div>
      ))}

      <h2>User Guides</h2>
      {userGuides.map((section, index) => (
        <div key={index}>
          <h3>{section.title}</h3>
          <p>{section.content}</p>
        </div>
      ))}

      <h2>FAQs</h2>
      {faqs.map((section, index) => (
        <div key={index}>
          <h3>{section.title}</h3>
          <p>{section.content}</p>
        </div>
      ))}
    </div>
  );
};

export default DocsComponent;

// src/components/DocsComponent.tsx
import React, { useState, useEffect } from 'react';

interface DocSection {
  title: string;
  content: string;
}

/**
 * DocsComponent: A component for displaying documentation for the SaaS product.
 * It fetches and renders different sections of documentation, such as API documentation,
 * user guides, and FAQs.
 */
const DocsComponent = () => {
  const [apiDocs, setApiDocs] = useState<DocSection[]>([]);
  const [userGuides, setUserGuides] = useState<DocSection[]>([]);
  const [faqs, setFaqs] = useState<DocSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching documentation from an API or local files
        const apiDocsData = await fetchApiDocs();
        const userGuidesData = await fetchUserGuides();
        const faqsData = await fetchFaqs();

        setApiDocs(apiDocsData);
        setUserGuides(userGuidesData);
        setFaqs(faqsData);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching documentation:", err);
        setError("Failed to load documentation. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Fetches API documentation.
   * @returns A promise that resolves to an array of DocSection objects.
   */
  const fetchApiDocs = async (): Promise<DocSection[]> => {
    // Simulate fetching API documentation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { title: "Authentication", content: "Details about authentication..." },
          { title: "Endpoints", content: "List of available API endpoints..." },
        ]);
      }, 500);
    });
  };

  /**
   * Fetches user guides.
   * @returns A promise that resolves to an array of DocSection objects.
   */
  const fetchUserGuides = async (): Promise<DocSection[]> => {
    // Simulate fetching user guides
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { title: "Getting Started", content: "A guide to getting started with the SaaS product..." },
          { title: "Advanced Features", content: "Details about advanced features..." },
        ]);
      }, 500);
    });
  };

  /**
   * Fetches FAQs.
   * @returns A promise that resolves to an array of DocSection objects.
   */
  const fetchFaqs = async (): Promise<DocSection[]> => {
    // Simulate fetching FAQs
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { title: "What is the SaaS product?", content: "An explanation of the SaaS product..." },
          { title: "How do I get support?", content: "Information about how to get support..." },
        ]);
      }, 500);
    });
  };

  if (loading) {
    return <div>Loading documentation...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Documentation</h1>
      <h2>API Documentation</h2>
      {apiDocs.map((section, index) => (
        <div key={index}>
          <h3>{section.title}</h3>
          <p>{section.content}</p>
        </div>
      ))}

      <h2>User Guides</h2>
      {userGuides.map((section, index) => (
        <div key={index}>
          <h3>{section.title}</h3>
          <p>{section.content}</p>
        </div>
      ))}

      <h2>FAQs</h2>
      {faqs.map((section, index) => (
        <div key={index}>
          <h3>{section.title}</h3>
          <p>{section.content}</p>
        </div>
      ))}
    </div>
  );
};

export default DocsComponent;