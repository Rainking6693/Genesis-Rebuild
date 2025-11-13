import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  message: string;
}

interface BlogPostData {
  id: number;
  title: string;
  description: string;
}

interface BlogPostDataProps {
  data: BlogPostData[];
}

const BlogPost: FC<Props> = ({ message }) => {
  const [data, setData] = useState<BlogPostData[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<BlogPostData[]>('https://api.reviewrocket.com/latest-news');

        if (response.data.length > 0) {
          setData(response.data);
        } else {
          setError(new Error('No data received from the API'));
        }
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Boost Your Business with Review Rocket</h1>
      <p>{message}</p>
      {data.length > 0 && <BlogPostData data={data} />}
      {error && <div role="alert">An error occurred while fetching data: {error.message}</div>}
      <hr />
      <h2>Learn More</h2>
      <p>
        Discover how Review Rocket can help your small business streamline customer review responses and improve engagement. Visit our website today!
      </p>
    </div>
  );
};

const BlogPostData: React.FC<BlogPostDataProps> = ({ data }) => {
  return (
    <div>
      <h3>Latest News</h3>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogPost;

import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';

interface Props {
  message: string;
}

interface BlogPostData {
  id: number;
  title: string;
  description: string;
}

interface BlogPostDataProps {
  data: BlogPostData[];
}

const BlogPost: FC<Props> = ({ message }) => {
  const [data, setData] = useState<BlogPostData[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<BlogPostData[]>('https://api.reviewrocket.com/latest-news');

        if (response.data.length > 0) {
          setData(response.data);
        } else {
          setError(new Error('No data received from the API'));
        }
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Boost Your Business with Review Rocket</h1>
      <p>{message}</p>
      {data.length > 0 && <BlogPostData data={data} />}
      {error && <div role="alert">An error occurred while fetching data: {error.message}</div>}
      <hr />
      <h2>Learn More</h2>
      <p>
        Discover how Review Rocket can help your small business streamline customer review responses and improve engagement. Visit our website today!
      </p>
    </div>
  );
};

const BlogPostData: React.FC<BlogPostDataProps> = ({ data }) => {
  return (
    <div>
      <h3>Latest News</h3>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogPost;