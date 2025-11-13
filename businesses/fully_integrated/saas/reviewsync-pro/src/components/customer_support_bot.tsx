import React, { FC, DetailedHTMLProps, HTMLAttributes, Key } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  // Add a unique ID for each instance of the component to ensure proper re-rendering
  id?: string;
}

const CustomerSupportBot: FC<Props> = ({ className, message, id, ...rest }) => {
  // Use a semantic HTML element for accessibility purposes
  const semanticElement = 'article'; // You can change this to 'section' or 'aside' depending on the context

  // Generate a unique ID if not provided
  const uniqueId = id || Math.random().toString(36).substring(7);

  return (
    <div className={`review-sync-pro-customer-support-bot ${className}`} key={uniqueId} id={uniqueId} {...rest}>
      <aside role="complementary"> {/* Add a role attribute for accessibility */}
        <h2>Customer Support Bot</h2>
        <p dangerouslySetInnerHTML={{ __html: message }} /> {/* Use dangerouslySetInnerHTML to handle HTML in the message */}
      </aside>
    </div>
  );
};

CustomerSupportBot.displayName = 'ReviewSyncProCustomerSupportBot';

export default CustomerSupportBot;

In this updated version, I've added an optional `id` prop to ensure a unique identifier for each instance of the component. I've also used a semantic HTML element (`aside`) to improve accessibility. Additionally, I've used `dangerouslySetInnerHTML` to handle HTML in the message, which can be useful for edge cases where the message contains HTML tags.