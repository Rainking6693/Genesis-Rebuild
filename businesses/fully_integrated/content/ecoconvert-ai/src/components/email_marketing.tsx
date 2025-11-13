import React, { PropsWithChildren, ReactNode } from 'react';
import { EcoConvertAI } from '../../../constants';

interface EcoConvertAIWebsiteProps {
  website: string;
}

const EcoConvertAIWebsite = ({ website }: EcoConvertAIWebsiteProps) => {
  // Add a check for a valid URL before rendering the link
  const isValidUrl = (url: string) => {
    const urlPattern = /^(https?:\/\/.)?(www\.)?[a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
    return urlPattern.test(url);
  };

  if (!isValidUrl(website)) {
    return <div>Invalid URL provided for EcoConvertAI website.</div>;
  }

  return <a href={website} target="_blank" rel="noopener noreferrer">{website}</a>;
};

interface Props {
  subject: string;
  message: string;
}

const FunctionalComponent: React.FC<Props> = ({ subject, message }) => {
  // Use ReactNode for the children prop to allow for more flexibility
  const children: ReactNode = React.Children.toArray(arguments).slice(2);

  return (
    <div>
      <h1>{subject}</h1>
      <p>{message}</p>
      {children.map((child, index) => (
        <React.Fragment key={index}>{child}</React.Fragment>
      ))}
      <EcoConvertAIWebsite website={EcoConvertAI.website} />
    </div>
  );
};

// Add a defaultProps object to set default values for props
FunctionalComponent.defaultProps = {
  children: [],
};

export default FunctionalComponent;

import React, { PropsWithChildren, ReactNode } from 'react';
import { EcoConvertAI } from '../../../constants';

interface EcoConvertAIWebsiteProps {
  website: string;
}

const EcoConvertAIWebsite = ({ website }: EcoConvertAIWebsiteProps) => {
  // Add a check for a valid URL before rendering the link
  const isValidUrl = (url: string) => {
    const urlPattern = /^(https?:\/\/.)?(www\.)?[a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
    return urlPattern.test(url);
  };

  if (!isValidUrl(website)) {
    return <div>Invalid URL provided for EcoConvertAI website.</div>;
  }

  return <a href={website} target="_blank" rel="noopener noreferrer">{website}</a>;
};

interface Props {
  subject: string;
  message: string;
}

const FunctionalComponent: React.FC<Props> = ({ subject, message }) => {
  // Use ReactNode for the children prop to allow for more flexibility
  const children: ReactNode = React.Children.toArray(arguments).slice(2);

  return (
    <div>
      <h1>{subject}</h1>
      <p>{message}</p>
      {children.map((child, index) => (
        <React.Fragment key={index}>{child}</React.Fragment>
      ))}
      <EcoConvertAIWebsite website={EcoConvertAI.website} />
    </div>
  );
};

// Add a defaultProps object to set default values for props
FunctionalComponent.defaultProps = {
  children: [],
};

export default FunctionalComponent;