import React, { FC, ReactNode } from 'react';

interface Props {
  message: string;
  socialMediaLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
}

const VideoScriptAIComponent: FC<Props> = ({ message, socialMediaLinks }) => {
  const socialMediaLinksList = Object.entries(socialMediaLinks || {}).filter(
    ([_, link]) => typeof link === 'string'
  ).map(([platform, link]) => (
    <a key={platform} href={link} target="_blank" rel="noopener noreferrer">
      {platform.toUpperCase()}
    </a>
  ));

  return (
    <div className="video-script-ai-component" aria-label="VideoScript AI component">
      {/* Add appropriate HTML structure for accessibility and SEO */}
      <header>
        <h1>VideoScript AI</h1>
      </header>
      <main>
        <article>
          <h2>Transform Your Content into Video Scripts</h2>
          <p>{message}</p>
        </article>
      </main>
      <footer>
        {/* Include links to social media platforms and contact information */}
        {socialMediaLinksList.length > 0 && (
          <>
            <h3>Contact Us</h3>
            {socialMediaLinksList}
          </>
        )}
      </footer>
    </div>
  );
};

export default VideoScriptAIComponent;

import React, { FC, ReactNode } from 'react';

interface Props {
  message: string;
  socialMediaLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
}

const VideoScriptAIComponent: FC<Props> = ({ message, socialMediaLinks }) => {
  const socialMediaLinksList = Object.entries(socialMediaLinks || {}).filter(
    ([_, link]) => typeof link === 'string'
  ).map(([platform, link]) => (
    <a key={platform} href={link} target="_blank" rel="noopener noreferrer">
      {platform.toUpperCase()}
    </a>
  ));

  return (
    <div className="video-script-ai-component" aria-label="VideoScript AI component">
      {/* Add appropriate HTML structure for accessibility and SEO */}
      <header>
        <h1>VideoScript AI</h1>
      </header>
      <main>
        <article>
          <h2>Transform Your Content into Video Scripts</h2>
          <p>{message}</p>
        </article>
      </main>
      <footer>
        {/* Include links to social media platforms and contact information */}
        {socialMediaLinksList.length > 0 && (
          <>
            <h3>Contact Us</h3>
            {socialMediaLinksList}
          </>
        )}
      </footer>
    </div>
  );
};

export default VideoScriptAIComponent;