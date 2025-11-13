import React from 'react';
import { SEO_META_TAGS } from '../../constants/seo';

interface Props {
  title: string;
  description: string;
  lang?: string;
  imageUrl?: string;
  url?: string;
}

const StressLensAI: React.FC<Props> = ({ title, description, lang = 'en', imageUrl, url = window.location.href }) => {
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="language" content={lang} />
      <meta name="description" content={description} />
      <title>{title}</title>
      <link rel="canonical" href={url} />
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />

      {imageUrl && (
        <>
          <meta property="og:image" content={imageUrl} />
          <meta name="twitter:image" content={imageUrl} />
        </>
      )}

      {/* Add ARIA attributes for accessibility */}
      <meta name="description" aria-label={description} />
      <title aria-label={title} />
    </>
  );
};

export default StressLensAI;

Changes made:

1. Added `url` prop to handle the canonical URL.
2. Checked for the existence of the `imageUrl` prop before rendering the related meta tags.
3. Added ARIA attributes for accessibility to the `description` and `title` meta tags.
4. Removed the `dangerouslySetInnerHTML` as it's not recommended for SEO and can potentially introduce security risks. Instead, I've added ARIA attributes for the description content.
5. Removed the unnecessary duplicated component.
6. Used TypeScript interfaces for props to ensure type safety.
7. Used the `url` prop instead of `window.location.pathname` for the canonical URL to handle edge cases like when the component is rendered on a different URL.
8. Used the `aria-label` attribute to provide a text alternative for non-visible content, improving accessibility.