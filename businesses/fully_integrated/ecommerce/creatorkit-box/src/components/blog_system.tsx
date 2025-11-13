import React, { useContext, useEffect, useState } from 'react';
import { sanitizeUserInput } from '../../security/input-sanitizer';
import { NicheContext } from '../context/NicheContext'; // Assuming there's a NicheContext

interface Props {
  message: string;
}

interface BlogData {
  id: number;
  title: string;
  content: string;
}

const MyComponent: React.FC<Props> = ({ message }) => {
  const { niche } = useContext(NicheContext); // Get niche from context
  const [error, setError] = useState<Error | null>(null);
  const [blogData, setBlogData] = useState<BlogData[] | null>(null);

  const [data, refetchBlogData] = useBlogData(niche); // Use custom hook

  useEffect(() => {
    if (data) {
      setBlogData(data);
    }
  }, [data]);

  useEffect(() => {
    if (!blogData) {
      refetchBlogData(); // Refetch data when component mounts
    }
  }, []);

  useEffect(() => {
    if (!blogData) {
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/blogs?niche=${niche}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setBlogData(json);
      } catch (error) {
        setError(error);
      }
    };

    if (JSON.stringify(blogData) !== JSON.stringify(getBlogDataFromContext())) {
      fetchData(); // Refetch data when niche changes
    }
  }, [niche]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {message}
      {blogData &&
        blogData.map((item: BlogData) => (
          <div key={item.id}>
            <h2>{item.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: sanitizeUserInput(item.content) }} />
          </div>
        ))}
    </div>
  );
};

export default MyComponent;

// Add a custom hook for fetching and caching blog data
import { useEffect, useState } from 'react';

const useBlogData = (niche: string) => {
  const [data, setData] = useState<BlogData[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/blogs?niche=${niche}`);
      const json = await response.json();
      setData(json);
    };

    if (!data) {
      fetchData();
    }
  }, [niche]);

  return [data, fetchData]; // Return data and refetch function
};

import React, { useContext, useEffect, useState } from 'react';
import { sanitizeUserInput } from '../../security/input-sanitizer';
import { NicheContext } from '../context/NicheContext'; // Assuming there's a NicheContext

interface Props {
  message: string;
}

interface BlogData {
  id: number;
  title: string;
  content: string;
}

const MyComponent: React.FC<Props> = ({ message }) => {
  const { niche } = useContext(NicheContext); // Get niche from context
  const [error, setError] = useState<Error | null>(null);
  const [blogData, setBlogData] = useState<BlogData[] | null>(null);

  const [data, refetchBlogData] = useBlogData(niche); // Use custom hook

  useEffect(() => {
    if (data) {
      setBlogData(data);
    }
  }, [data]);

  useEffect(() => {
    if (!blogData) {
      refetchBlogData(); // Refetch data when component mounts
    }
  }, []);

  useEffect(() => {
    if (!blogData) {
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/blogs?niche=${niche}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setBlogData(json);
      } catch (error) {
        setError(error);
      }
    };

    if (JSON.stringify(blogData) !== JSON.stringify(getBlogDataFromContext())) {
      fetchData(); // Refetch data when niche changes
    }
  }, [niche]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {message}
      {blogData &&
        blogData.map((item: BlogData) => (
          <div key={item.id}>
            <h2>{item.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: sanitizeUserInput(item.content) }} />
          </div>
        ))}
    </div>
  );
};

export default MyComponent;

// Add a custom hook for fetching and caching blog data
import { useEffect, useState } from 'react';

const useBlogData = (niche: string) => {
  const [data, setData] = useState<BlogData[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/blogs?niche=${niche}`);
      const json = await response.json();
      setData(json);
    };

    if (!data) {
      fetchData();
    }
  }, [niche]);

  return [data, fetchData]; // Return data and refetch function
};