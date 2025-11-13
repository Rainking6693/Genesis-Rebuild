import React, { useState, ReactNode } from 'react';

type NewsletterItemProps = {
  index: number;
  newsletterTitle: string;
  newsletterDescription: string;
};

const NewsletterItem: React.FC<NewsletterItemProps> = ({ index, newsletterTitle, newsletterDescription }) => {
  return (
    <div className="newsletter-item" key={index}>
      <h3>{newsletterTitle}</h3>
      <p>{newsletterDescription}</p>
    </div>
  );
};

type Props = {
  newsletters?: Array<{ title: string; description: string }>;
  numNewsletters?: number;
};

const NewsletterList: React.FC<Props> = ({ newsletters = generateDefaultNewsletters(), numNewsletters = 5 }) => {
  const [displayedNewsletters, setDisplayedNewsletters] = useState<Array<{ title: string; description: string }>>(newsletters.slice(0, numNewsletters));

  const handleLoadMore = () => {
    const newNewsletters = newsletters.slice(displayedNewsletters.length, displayedNewsletters.length + numNewsletters);
    setDisplayedNewsletters(prev => [...prev, ...newNewsletters]);
  };

  if (displayedNewsletters.length === 0) {
    return <div className="newsletter-list-loading">Loading newsletters...</div>;
  }

  return (
    <div className="newsletter-list">
      {displayedNewsletters.map((newsletter, index) => (
        <NewsletterItem key={index} index={index} newsletterTitle={newsletter.title} newsletterDescription={newsletter.description} />
      ))}
      {displayedNewsletters.length < newsletters.length && <button onClick={handleLoadMore}>Load More</button>}
    </div>
  );
};

const generateDefaultNewsletters = (): Array<{ title: string; description: string }> => {
  const newsletters: Array<{ title: string; description: string }> = [];
  for (let i = 0; i < 10; i++) {
    newsletters.push({
      title: `Newsletter #${i + 1}`,
      description: `This is a sample newsletter description for Newsletter #${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    });
  }
  return newsletters;
};

export default NewsletterList;

import React, { useState, ReactNode } from 'react';

type NewsletterItemProps = {
  index: number;
  newsletterTitle: string;
  newsletterDescription: string;
};

const NewsletterItem: React.FC<NewsletterItemProps> = ({ index, newsletterTitle, newsletterDescription }) => {
  return (
    <div className="newsletter-item" key={index}>
      <h3>{newsletterTitle}</h3>
      <p>{newsletterDescription}</p>
    </div>
  );
};

type Props = {
  newsletters?: Array<{ title: string; description: string }>;
  numNewsletters?: number;
};

const NewsletterList: React.FC<Props> = ({ newsletters = generateDefaultNewsletters(), numNewsletters = 5 }) => {
  const [displayedNewsletters, setDisplayedNewsletters] = useState<Array<{ title: string; description: string }>>(newsletters.slice(0, numNewsletters));

  const handleLoadMore = () => {
    const newNewsletters = newsletters.slice(displayedNewsletters.length, displayedNewsletters.length + numNewsletters);
    setDisplayedNewsletters(prev => [...prev, ...newNewsletters]);
  };

  if (displayedNewsletters.length === 0) {
    return <div className="newsletter-list-loading">Loading newsletters...</div>;
  }

  return (
    <div className="newsletter-list">
      {displayedNewsletters.map((newsletter, index) => (
        <NewsletterItem key={index} index={index} newsletterTitle={newsletter.title} newsletterDescription={newsletter.description} />
      ))}
      {displayedNewsletters.length < newsletters.length && <button onClick={handleLoadMore}>Load More</button>}
    </div>
  );
};

const generateDefaultNewsletters = (): Array<{ title: string; description: string }> => {
  const newsletters: Array<{ title: string; description: string }> = [];
  for (let i = 0; i < 10; i++) {
    newsletters.push({
      title: `Newsletter #${i + 1}`,
      description: `This is a sample newsletter description for Newsletter #${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    });
  }
  return newsletters;
};

export default NewsletterList;