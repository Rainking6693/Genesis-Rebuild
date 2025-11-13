import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Props {
  platform: string; // Add specific platform as prop for component customization
}

interface ContentBriefResponse {
  // Define the structure of the content brief response
}

interface TrendingTopicsResponse {
  topics: string[]; // Define the structure of the trending topics response
}

interface Error {
  message: string; // Define the structure of the error object
}

const MyComponent: React.FC<Props> = ({ platform }) => {
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const fetchTrendingTopics = async () => {
    try {
      const response: TrendingTopicsResponse = await axios.get<TrendingTopicsResponse>(`https://api.creatorcompass.com/trends/${platform}`);
      setTrendingTopics(response.topics);
    } catch (error) {
      setError(error as Error);
    }
  };

  const handleClick = (topic: string) => {
    generateContentBrief(topic);
  };

  const generateContentBrief = async (topic: string) => {
    try {
      const response: ContentBriefResponse = await axios.post<ContentBriefResponse>(`https://api.creatorcompass.com/content-brief`, { topic });
      // Handle response and display content brief
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTrendingTopics();
  }, [platform]); // Add platform to dependency array to ensure the function runs when platform changes

  return (
    <div>
      <h1>Trending Topics for {platform}</h1>
      {error && <p role="alert">Error fetching trending topics: {error.message}</p>}
      <ul role="list">
        {trendingTopics.map((topic) => (
          <li key={topic} role="listitem" onClick={() => handleClick(topic)}>
            {topic}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyComponent;

1. Added an `error` state to handle errors when fetching trending topics.
2. Added a check for the `error` state to display an error message if there's an issue fetching the data, using the `role="alert"` attribute for accessibility.
3. Added the `platform` prop to the dependency array in the `useEffect` hook to ensure the function runs when the platform changes.
4. Made the component more accessible by adding proper ARIA attributes to the `ul` and `li` elements.
5. Improved maintainability by using TypeScript interfaces and type annotations.
6. Added comments to explain the functionality of the component.