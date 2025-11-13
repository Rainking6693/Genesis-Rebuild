import axios from 'axios';
import { ContentItem } from './ContentItem';

interface SocialMediaProps {
  apiUrl: string;
}

class SocialMedia extends React.Component<SocialMediaProps> {
  state = {
    contentItems: [] as ContentItem[],
    error: null as Error | null,
  };

  componentDidMount() {
    this.fetchContent();
  }

  async fetchContent() {
    try {
      const response = await axios.get(this.props.apiUrl);
      this.setState({ contentItems: response.data });
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    const { contentItems, error } = this.state;

    if (error) {
      return (
        <div>
          <h2>An error occurred:</h2>
          <p>{error.message}</p>
        </div>
      );
    }

    if (contentItems.length === 0) {
      return <div>No content available.</div>;
    }

    return (
      <div>
        {contentItems.map((item) => (
          <ContentItem key={item.id} {...item} />
        ))}
      </div>
    );
  }
}

export default SocialMedia;

interface ContentItem {
  id: number;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  accessibilityLabel: string;
}

import axios from 'axios';
import { ContentItem } from './ContentItem';

interface SocialMediaProps {
  apiUrl: string;
}

class SocialMedia extends React.Component<SocialMediaProps> {
  state = {
    contentItems: [] as ContentItem[],
    error: null as Error | null,
  };

  componentDidMount() {
    this.fetchContent();
  }

  async fetchContent() {
    try {
      const response = await axios.get(this.props.apiUrl);
      this.setState({ contentItems: response.data });
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    const { contentItems, error } = this.state;

    if (error) {
      return (
        <div>
          <h2>An error occurred:</h2>
          <p>{error.message}</p>
        </div>
      );
    }

    if (contentItems.length === 0) {
      return <div>No content available.</div>;
    }

    return (
      <div>
        {contentItems.map((item) => (
          <ContentItem key={item.id} {...item} />
        ))}
      </div>
    );
  }
}

export default SocialMedia;

interface ContentItem {
  id: number;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  accessibilityLabel: string;
}