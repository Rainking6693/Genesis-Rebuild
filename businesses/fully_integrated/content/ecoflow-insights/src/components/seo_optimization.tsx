import React from 'react';
import { SEO } from 'seo-darwin';

interface Props {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  // Adding default values for optional props
  titleDefault?: string = 'Default Title';
  descriptionDefault?: string = 'Default Description';
  keywordsDefault?: string[] = [];
  imageDefault?: string = '/default-image.jpg';
  urlDefault?: string = window.location.href;
  // Adding a new prop for the language
  language?: string;
  // Adding a new prop for the type
  type?: string;
}

const MyComponent: React.FC<Props> = ({
  title = titleDefault,
  description = descriptionDefault,
  keywords = keywordsDefault,
  image = imageDefault,
  url = urlDefault,
  language = 'en-US',
  type = 'website',
  message,
  ...seoProps
}) => {
  // Check if the provided URL is valid
  const validUrl = /^(http|https|mailto|ftp|file):\/\/[^ "]+$/.test(url);
  const finalUrl = validUrl ? url : window.location.href;

  // Check if the provided image URL is valid
  const validImage = /^(http|https|data):\/\//.test(image);
  const finalImage = validImage ? image : '/default-image.jpg';

  // Check if the provided language is valid
  const validLanguage = /^[a-zA-Z]{2}-[A-Z]{2}$/.test(language);
  const finalLanguage = validLanguage ? language : 'en-US';

  // Check if the provided type is valid
  const validType = /^(website|article|video|other)$/.test(type);
  const finalType = validType ? type : 'website';

  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        image={finalImage}
        url={finalUrl}
        language={finalLanguage}
        type={finalType}
        // Adding additional SEO properties for better optimization
        ogTitle={title}
        ogDescription={description}
        ogImage={finalImage}
        {...seoProps}
      />
      <div>{message}</div>
    </>
  );
};

export default MyComponent;

In this updated version, I've added support for the `language` and `type` properties in the SEO component. I've also expanded the URL validation to include mailto, ftp, and file protocols. Additionally, I've added checks for the provided language and type to ensure they are valid. This makes the component more robust and adaptable to various use cases.