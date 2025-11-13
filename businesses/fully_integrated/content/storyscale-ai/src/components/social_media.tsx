import React, { FC, PropsWithChildren, useRef } from 'react';

interface Props {
  title: string;
  message: string;
  url: string;
  imageUrl?: string; // Add optional imageUrl for Open Graph
}

const SocialMediaPost: FC<Props> = ({ title, message, url, imageUrl }) => {
  const socialMediaPostRef = useRef<HTMLArticleElement>(null);

  // Add appropriate HTML tags for social media post formatting
  return (
    <article
      className="social-media-post"
      ref={socialMediaPostRef} // Store a reference to the article element for testing purposes
    >
      <header>
        <h2>{title}</h2>
      </header>
      <section>
        <p>{message}</p>
      </section>
      {/* Include relevant meta tags for SEO and social sharing */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={message} />
      <meta property="og:url" content={url} />
      {imageUrl && <meta property="og:image" content={imageUrl} />} // Include optional imageUrl for Open Graph
      {/* Add any necessary accessibility attributes */}
      <div aria-label="Social media post">
        {/* Include a link to the original content for accessibility and SEO */}
        <a href={url}>Read more</a>
      </div>
    </article>
  );
};

export default SocialMediaPost;

import React, { FC, PropsWithChildren, useRef } from 'react';

interface Props {
  title: string;
  message: string;
  url: string;
  imageUrl?: string; // Add optional imageUrl for Open Graph
}

const SocialMediaPost: FC<Props> = ({ title, message, url, imageUrl }) => {
  const socialMediaPostRef = useRef<HTMLArticleElement>(null);

  // Add appropriate HTML tags for social media post formatting
  return (
    <article
      className="social-media-post"
      ref={socialMediaPostRef} // Store a reference to the article element for testing purposes
    >
      <header>
        <h2>{title}</h2>
      </header>
      <section>
        <p>{message}</p>
      </section>
      {/* Include relevant meta tags for SEO and social sharing */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={message} />
      <meta property="og:url" content={url} />
      {imageUrl && <meta property="og:image" content={imageUrl} />} // Include optional imageUrl for Open Graph
      {/* Add any necessary accessibility attributes */}
      <div aria-label="Social media post">
        {/* Include a link to the original content for accessibility and SEO */}
        <a href={url}>Read more</a>
      </div>
    </article>
  );
};

export default SocialMediaPost;