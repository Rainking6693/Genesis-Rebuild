import React from 'react';
import PropTypes from 'prop-types';

interface Props {
  title: string;
  subtitle: string;
  content: string;
}

const BlogPost: React.FC<Props> = ({ title, subtitle, content }) => {
  if (!title || !subtitle || !content) {
    return null; // Return null if any prop is missing
  }

  return (
    <div className="blog-post" aria-label="Blog post">
      <h1 className="blog-post__title" aria-level="1">{title}</h1>
      <h2 className="blog-post__subtitle" aria-level="2">{subtitle}</h2>
      <div
        className="blog-post__content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

BlogPost.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default BlogPost;

// ClimateScoreProBlog.tsx
import React from 'react';
import BlogPost from './BlogPost';

interface Props {
  title: string;
  subtitle: string;
  content: string;
}

const ClimateScoreProBlog: React.FC<Props> = ({ title, subtitle, content }) => {
  const blogPostData: Props = {
    title: 'Empowering Small Businesses with ClimateScore Pro',
    subtitle: 'Learn how our AI-powered platform helps companies meet sustainability compliance and win eco-conscious customers',
    content: `
      <p>Welcome to the ClimateScore Pro blog! Here, we share insights, tips, and success stories about how our platform is revolutionizing the way small businesses approach sustainability compliance.</p>
      <p>Our AI-powered platform automatically generates ESG reports and carbon footprint assessments, making it easy for companies to meet regulatory requirements and attract eco-conscious customers.</p>
      <p>Stay tuned for more updates and join us on our mission to create a more sustainable future for all businesses.</p>
    `,
  };

  return <BlogPost {...blogPostData} />;
};

export default ClimateScoreProBlog;

// BlogPost.module.css
.blog-post {
  max-width: 800px;
  margin: 0 auto;
}

.blog-post__title {
  font-size: 3rem;
  font-weight: bold;
}

.blog-post__subtitle {
  font-size: 2rem;
  font-weight: 500;
}

.blog-post__content {
  font-size: 1.2rem;
  line-height: 1.5;
}

In this updated code, I've added PropTypes to the `BlogPost` component to ensure that all required props are provided. I've also added an accessibility check by providing `aria-label` and `aria-level` attributes to the parent `div` and heading elements, respectively. Furthermore, I've added an edge case to return null if any of the props are missing. Lastly, I've extracted the blog post data into a separate props object to make the code more readable and maintainable. This also allows for easier testing of the component.

For the CSS, I've kept it the same as provided in the original code. However, you can further improve it by adding more specificity to the class names, using semantic HTML, and ensuring that the color contrast ratio meets the WCAG guidelines for accessibility.