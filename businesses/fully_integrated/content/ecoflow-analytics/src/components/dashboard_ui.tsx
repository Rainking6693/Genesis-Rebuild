import React, { FC, ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  data: DashboardData;
}

interface DashboardData {
  score?: number;
  improvement?: string;
  topImpactAreas?: string[];
  marketingContent?: ReactNode[];
}

const DashboardUI: FC<Props> = ({ title, subtitle, data }) => {
  if (!data) return null;

  return (
    <div>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <div>
        {data.score && <p>Score: {data.score}</p>}
        {data.improvement && <p>Improvement: {data.improvement}</p>}
        {data.topImpactAreas && (
          <>
            <h3>Top Impact Areas</h3>
            <ul>
              {data.topImpactAreas.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </>
        )}
        {data.marketingContent && (
          <>
            <h3>Marketing Content</h3>
            <ul>
              {data.marketingContent.map((content, index) => (
                <li key={index}>{content}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardUI;

1. Added a `DashboardData` interface to better define the shape of the `data` prop.
2. Added null checks for the `data` prop to prevent errors when it's undefined or null.
3. Wrapped the `topImpactAreas` and `marketingContent` sections in conditional rendering to only render them when they have data.
4. Wrapped the `topImpactAreas` and `marketingContent` sections in a `<>` tag to allow for better nesting of HTML elements.
5. Added accessibility by providing proper semantic HTML elements (`<h1>`, `<h2>`, `<h3>`, `<ul>`, `<li>`) for the content.
6. Made the code more maintainable by using TypeScript interfaces and null checks.