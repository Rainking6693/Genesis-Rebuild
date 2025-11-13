import React, { FC, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  subject: string;
  preheader?: string; // Added optional preheader
  body: string;
  altText?: string; // Added alt text for images
}

const MyEmailComponent: FC<Props> = ({ subject, preheader, body, altText }) => {
  const sanitizedBody = DOMPurify.sanitize(body); // Use a safe-html library to sanitize the body content

  return (
    <div>
      <h1>{subject}</h1>
      {preheader && <p>{preheader}</p>} // Render preheader if provided
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizedBody.replace(/<img[^>]*?(?:(?!<\/img>).)*?>/g, (match) => {
            const img = match.match(/<img.*?src="(.*?)"(?:.*?)>/i);
            if (img) {
              return `<img src="${img[1]}" alt="${altText || ''}" />`;
            }
            return match;
          }),
        }}
      />
    </div>
  );
};

export default MyEmailComponent;

import React, { FC, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  subject: string;
  preheader?: string; // Added optional preheader
  body: string;
  altText?: string; // Added alt text for images
}

const MyEmailComponent: FC<Props> = ({ subject, preheader, body, altText }) => {
  const sanitizedBody = DOMPurify.sanitize(body); // Use a safe-html library to sanitize the body content

  return (
    <div>
      <h1>{subject}</h1>
      {preheader && <p>{preheader}</p>} // Render preheader if provided
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizedBody.replace(/<img[^>]*?(?:(?!<\/img>).)*?>/g, (match) => {
            const img = match.match(/<img.*?src="(.*?)"(?:.*?)>/i);
            if (img) {
              return `<img src="${img[1]}" alt="${altText || ''}" />`;
            }
            return match;
          }),
        }}
      />
    </div>
  );
};

export default MyEmailComponent;