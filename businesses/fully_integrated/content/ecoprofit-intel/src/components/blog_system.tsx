import React, { FC, ReactNode, useEffect, useState } from 'react';
import { EcoProfitIntel as ecoProfitIntel } from '../../../business_context';

interface Props {
  title: string;
  content: string;
}

interface BusinessContext {
  name: string;
  description: string;
}

const BlogPost: FC<Props> = ({ title, content }) => {
  const [businessContext, setBusinessContext] = useState<BusinessContext | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessContext = async () => {
      try {
        const context = await ecoProfitIntel.getBusinessContext();
        if (context) setBusinessContext(context);
      } catch (error) {
        setError('Error: Unable to access EcoProfit Intel business context.');
      }
    };

    fetchBusinessContext();
  }, []);

  if (!businessContext && error) {
    return <div>{error}</div>;
  }

  if (!businessContext) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <footer>
        Powered by {businessContext.name} - {businessContext.description}
      </footer>
    </div>
  );
};

export default BlogPost;

import React, { FC, ReactNode, useEffect, useState } from 'react';
import { EcoProfitIntel as ecoProfitIntel } from '../../../business_context';

interface Props {
  title: string;
  content: string;
}

interface BusinessContext {
  name: string;
  description: string;
}

const BlogPost: FC<Props> = ({ title, content }) => {
  const [businessContext, setBusinessContext] = useState<BusinessContext | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessContext = async () => {
      try {
        const context = await ecoProfitIntel.getBusinessContext();
        if (context) setBusinessContext(context);
      } catch (error) {
        setError('Error: Unable to access EcoProfit Intel business context.');
      }
    };

    fetchBusinessContext();
  }, []);

  if (!businessContext && error) {
    return <div>{error}</div>;
  }

  if (!businessContext) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <footer>
        Powered by {businessContext.name} - {businessContext.description}
      </footer>
    </div>
  );
};

export default BlogPost;