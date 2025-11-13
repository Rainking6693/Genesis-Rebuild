import React, { PropsWithChildren, ReactNode } from 'react';
import { EcoSpendAI } from '../../../constants';

interface TitleProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  title: string;
}

interface SubtitleProps {
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  subtitle: string;
}

interface ContentProps {
  children: ReactNode;
}

interface FooterProps {
  footerText: string;
  ariaLabel?: string;
}

type Props = TitleProps & SubtitleProps & ContentProps & FooterProps;

const Title: React.FC<TitleProps> = ({ title, as = 'h1' }) => {
  return <as.type>{title}</as.type>;
};

const Subtitle: React.FC<SubtitleProps> = ({ subtitle, as = 'h2' }) => {
  return <as.type>{subtitle}</as.type>;
};

const Content: React.FC<ContentProps> = ({ children }) => {
  return <div>{children}</div>;
};

const Footer: React.FC<FooterProps> = ({ footerText, ariaLabel }) => {
  return (
    <footer aria-label={ariaLabel}>
      <small>{footerText}</small>
    </footer>
  );
};

const MyComponent: React.FC<Props> = ({ title, subtitle, children, footerText, ariaLabel }) => {
  return (
    <div>
      <Title title={title} />
      <Subtitle subtitle={subtitle} />
      {children}
      <Footer footerText={`Powered by ${EcoSpendAI} - Your AI-powered expense tracking and climate action partner.`} ariaLabel={ariaLabel} />
    </div>
  );
};

export default MyComponent;

In this refactored code, I've added the `as` prop to Title and Subtitle components to make them more flexible. I've also made the Content component more generic by using the `children` prop instead of `content`. For the Footer component, I've added an `aria-label` prop for better accessibility. Additionally, I've removed the dangerouslySetInnerHTML and replaced it with the more generic `children` prop for the Content component. This allows for more flexibility in rendering the content, such as using other React elements if needed.