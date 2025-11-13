import { stripHtml } from 'string-strip-html';
import { Helmet } from 'react-helmet';

type StripHtmlResult = ReturnType<typeof stripHtml>;

function seoFriendlyTitle(title: string): string {
  let strippedTitle: StripHtmlResult['result'] | null = stripHtml(title);

  if (!strippedTitle) {
    throw new Error('Failed to strip HTML from title');
  }

  return strippedTitle.text.trim();
}

function seoFriendlyDescription(description: string, maxLength = 155): string {
  let strippedDescription: StripHtmlResult['result'] | null = stripHtml(description);

  if (!strippedDescription) {
    throw new Error('Failed to strip HTML from description');
  }

  const trimmedDescription = strippedDescription.text.trim();
  return trimmedDescription.length > maxLength ? `${trimmedDescription.slice(0, maxLength)}...` : trimmedDescription;
}

interface Props {
  seoTitle: string; // Add SEO-friendly title for each page
  seoDescription: string; // Add SEO-friendly description for each page
  message: string;
}

const MyComponent: React.FC<Props> = ({ seoTitle, seoDescription, message }) => {
  const seoFriendlySeoTitle = seoFriendlyTitle(seoTitle);
  const seoFriendlySeoDescription = seoFriendlyDescription(seoDescription);

  return (
    <div>
      {/* Wrap content in a container for better responsiveness */}
      <div className="container">
        {/* Use semantic HTML elements for accessibility */}
        <Helmet>
          <title>{seoFriendlySeoTitle}</title>
          <meta name="description" content={seoFriendlySeoDescription} />
        </Helmet>
        <h1 id="page-title">{seoTitle}</h1>
        <main id="main-content" aria-labelledby="page-title">
          {message}
        </main>
      </div>
    </div>
  );
};

export default MyComponent;

In this code, I've added type safety to the `stripHtml` function's result, and I've added error handling for cases where the function fails to strip HTML. I've also added a `maxLength` parameter to the `seoFriendlyDescription` function to limit the description length for SEO purposes. Lastly, I've updated the Helmet usage to ensure that the SEO title and description are set correctly.