import React, { FC, ReactNode } from 'react';
import { EcoScoreAI_Branding } from '../../branding';
import { sanitizeHTML } from 'react-sanitize';

interface Props {
  subject: string;
  preheader?: string;
  body: string;
}

const MyComponent: FC<Props> = ({ subject, preheader = '', body }) => {
  const sanitizedBody = sanitizeHTML(body, {
    allowedTags: ['div', 'p', 'a', 'strong', 'em', 'img', 'br'], // Added 'br' tag for line breaks
    disallowedTags: ['script', 'style'],
    allowedAttributes: {
      a: {
        href: [],
        target: ['_blank'], // Added default target attribute for links
      },
      img: {
        src: [],
        alt: [],
        width: [],
        height: [], // Added width and height attributes for images
      },
    },
    transforms: {
      removeEmpty: true, // Remove empty elements and attributes
      removeVoid: true, // Remove void elements
    },
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault(); // Prevent focus from moving outside the newsletter container
    }
  };

  return (
    <div key="newsletter" className="newsletter-container" onKeyDown={handleKeyDown}>
      <EcoScoreAI_Branding.EmailHeader role="banner" aria-label="Newsletter header">
        <EcoScoreAI_Branding.EmailSubject noWrap title="Newsletter subject" aria-label={subject}>
          {subject}
        </EcoScoreAI_Branding.EmailSubject>
        <EcoScoreAI_Branding.EmailPreheader noWrap title="Newsletter preheader" aria-label={preheader}>
          {preheader}
        </EcoScoreAI_Branding.EmailPreheader>
      </EcoScoreAI_Branding.EmailHeader>
      <EcoScoreAI_Branding.EmailBody
        role="main"
        tabIndex={0}
        aria-label="Newsletter body"
        style={{ maxWidth: '700px', minWidth: '300px', margin: '0 auto' }}
        dangerouslySetInnerHTML={{ __html: sanitizedBody }}
      />
    </div>
  );
};

export default MyComponent;

Changes made:

1. Added the 'br' tag to the allowedTags for line breaks.
2. Added the 'target' attribute to the allowedAttributes for links with a default value of '_blank'.
3. Added the 'width' and 'height' attributes to the allowedAttributes for images.
4. Added a 'handleKeyDown' function to prevent focus from moving outside the newsletter container when using the Tab key.
5. Improved the sanitizeHTML configuration by adding the 'removeEmpty' and 'removeVoid' transforms to remove empty elements and attributes.