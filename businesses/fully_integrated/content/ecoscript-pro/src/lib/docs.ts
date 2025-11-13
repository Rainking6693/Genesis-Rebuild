import React, { FC, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { I18nContext, I18nContextType } from './i18n';

type HelmetTitleValue = string | undefined;
type HelmetDescriptionValue = string | undefined;
type HelmetKeywordsValue = string[] | undefined;
type HelmetLanguageValue = string | undefined;

interface Props {
  message: string;
  title?: HelmetTitleValue;
  description?: HelmetDescriptionValue;
  keywords?: HelmetKeywordsValue;
  language?: HelmetLanguageValue;
}

interface I18nContextType {
  t: (key: string) => string;
}

const MyComponent: FC<Props> = ({ message, title, description, keywords, language }) => {
  const { t } = useContext<I18nContextType>(I18nContext);

  const defaultTitle: HelmetTitleValue = t('EcoScriptPro.title') || undefined;
  const defaultDescription: HelmetDescriptionValue = t('EcoScriptPro.description') || undefined;
  const defaultKeywords: HelmetKeywordsValue = Array.isArray(t('EcoScriptPro.keywords'))
    ? t('EcoScriptPro.keywords')
    : [];
  const defaultLanguage: HelmetLanguageValue = 'en';

  return (
    <>
      <Helmet>
        <title>{title || defaultTitle}</title>
        <meta name="description" content={description || defaultDescription} />
        <meta name="keywords" content={keywords?.join(', ') || defaultKeywords.join(', ')} />
        <meta http-equiv="Content-Language" content={language || defaultLanguage} />
      </Helmet>
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </>
  );
};

// Add a linting rule to enforce consistent naming for components (PascalCase)
export const EcoScriptProMyComponent = MyComponent;

import React, { FC, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { I18nContext, I18nContextType } from './i18n';

type HelmetTitleValue = string | undefined;
type HelmetDescriptionValue = string | undefined;
type HelmetKeywordsValue = string[] | undefined;
type HelmetLanguageValue = string | undefined;

interface Props {
  message: string;
  title?: HelmetTitleValue;
  description?: HelmetDescriptionValue;
  keywords?: HelmetKeywordsValue;
  language?: HelmetLanguageValue;
}

interface I18nContextType {
  t: (key: string) => string;
}

const MyComponent: FC<Props> = ({ message, title, description, keywords, language }) => {
  const { t } = useContext<I18nContextType>(I18nContext);

  const defaultTitle: HelmetTitleValue = t('EcoScriptPro.title') || undefined;
  const defaultDescription: HelmetDescriptionValue = t('EcoScriptPro.description') || undefined;
  const defaultKeywords: HelmetKeywordsValue = Array.isArray(t('EcoScriptPro.keywords'))
    ? t('EcoScriptPro.keywords')
    : [];
  const defaultLanguage: HelmetLanguageValue = 'en';

  return (
    <>
      <Helmet>
        <title>{title || defaultTitle}</title>
        <meta name="description" content={description || defaultDescription} />
        <meta name="keywords" content={keywords?.join(', ') || defaultKeywords.join(', ')} />
        <meta http-equiv="Content-Language" content={language || defaultLanguage} />
      </Helmet>
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </>
  );
};

// Add a linting rule to enforce consistent naming for components (PascalCase)
export const EcoScriptProMyComponent = MyComponent;