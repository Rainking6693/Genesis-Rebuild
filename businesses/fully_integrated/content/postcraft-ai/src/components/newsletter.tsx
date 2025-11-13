import { validateEmail } from 'email-validator';

type NewsletterComponentProps = {
  email?: string;
};

const NewsletterComponent: React.FC<NewsletterComponentProps> = ({ email }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateEmail(email)) {
      console.log(`Welcome, ${email}! Subscribe to our newsletter.`);
    } else {
      console.log('Please provide a valid email address.');
    }
  };

  return (
    <section>
      <h2>Subscribe to our newsletter</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={email} />
        <button type="submit">Subscribe</button>
      </form>
    </section>
  );
};

export default NewsletterComponent;

import { validateEmail } from 'email-validator';

type NewsletterComponentProps = {
  email?: string;
};

const NewsletterComponent: React.FC<NewsletterComponentProps> = ({ email }) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateEmail(email)) {
      console.log(`Welcome, ${email}! Subscribe to our newsletter.`);
    } else {
      console.log('Please provide a valid email address.');
    }
  };

  return (
    <section>
      <h2>Subscribe to our newsletter</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={email} />
        <button type="submit">Subscribe</button>
      </form>
    </section>
  );
};

export default NewsletterComponent;