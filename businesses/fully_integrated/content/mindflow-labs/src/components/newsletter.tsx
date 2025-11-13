import React, { FC, useCallback, useRef, useState } from 'react';
import { transporter } from './email-config';

interface Props {
  message: string;
  onSendNewsletter: () => void;
}

const Newsletter: FC<Props> = ({ message, onSendNewsletter }) => {
  const newsletterRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendNewsletter = useCallback(async () => {
    if (!newsletterRef.current) return;

    try {
      await sendNewsletter(newsletterRef.current.innerHTML);
      onSendNewsletter();
    } catch (error) {
      setError(error.message);
    }
  }, [onSendNewsletter]);

  return (
    <div>
      {/* Add a unique identifier for accessibility purposes */}
      <div id="mindflow-newsletter" role="article" ref={newsletterRef}>
        {message}
      </div>
      {/* Add a button to send the newsletter */}
      <button onClick={handleSendNewsletter}>Send Newsletter</button>
      {/* Show an error message if there's an error sending the newsletter */}
      {error && <p role="alert">Error: {error}</p>}
    </div>
  );
};

// Create a function to send the newsletter
const sendNewsletter = async (message: string) => {
  try {
    // Use the transporter to send the email
    await transporter.sendMail({
      from: '"MindFlow Labs 💌" <noreply@mindflowlabs.com>', // Sender address
      to: 'recipient@example.com', // Recipient address
      subject: 'Your Personalized MindFlow Labs Newsletter 📰',
      html: message, // The newsletter content
    });

    console.log('Newsletter sent successfully!');
  } catch (error) {
    console.error('Error sending newsletter:', error);
    throw error;
  }
};

// Export the sendNewsletter function for usage
export { sendNewsletter };

// Import the Newsletter component and sendNewsletter function
import Newsletter from './Newsletter';
import { sendNewsletter } from './sendNewsletter';

// Wrap the Newsletter component with a higher-order component to handle sending the newsletter
const WithSendNewsletter = (WrappedComponent: FC<any>) => {
  return (props: any) => {
    const handleSendNewsletter = useCallback(() => {
      sendNewsletter(props.message);
    }, [props.message]);

    return <WrappedComponent {...props} onSendNewsletter={handleSendNewsletter} />;
  };
};

// Use the higher-order component to wrap the Newsletter component
const WrappedNewsletter = WithSendNewsletter(Newsletter);

export default WrappedNewsletter;

In this updated code, I've added an error state to show an error message if there's an error sending the newsletter. I've also made the sendNewsletter function throw an error if it encounters one, so that it can be caught and handled by the component. This makes the code more resilient and easier to debug. Additionally, I've added a try-catch block around the sendNewsletter function to handle any potential errors that might occur during the email sending process.