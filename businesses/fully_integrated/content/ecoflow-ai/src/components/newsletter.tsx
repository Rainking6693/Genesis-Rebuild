import React from 'react';

interface NewsletterProps {
  subject: string;
  greeting: string;
  carbonReductionPlan: string;
  socialMediaContent?: string[];
  callToAction?: string;
  className?: string;
}

const Newsletter: React.FC<NewsletterProps> = ({ subject, greeting, carbonReductionPlan, socialMediaContent = [], callToAction = '', className }) => {
  return (
    <div className={className}>
      <h1 role="banner" aria-level={1}>{subject}</h1>
      <p role="paragraph">{greeting}</p>
      <h2 role="heading" aria-level={2}>Your Personalized Carbon Reduction Action Plan</h2>
      <p>{carbonReductionPlan}</p>
      <h3 role="heading" aria-level={3}>Viral-Ready Social Media Content</h3>
      {socialMediaContent.length > 0 ? (
        <ul role="list">
          {socialMediaContent.map((content, index) => (
            <li key={index}>{content}</li>
          ))}
        </ul>
      ) : (
        <p>No social media content available.</p>
      )}
      <h3 role="heading" aria-level={3}>Take Action Today</h3>
      {callToAction.length > 0 ? (
        <p>{callToAction}</p>
      ) : (
        <p>No call to action provided.</p>
      )}
    </div>
  );
};

export default Newsletter;

In this updated version, I've added ARIA roles for better accessibility, used an unordered list (`<ul>`) for social media content to improve readability, and added a check for empty arrays to display a more informative message. Additionally, I've made some minor changes to the component structure for better maintainability.