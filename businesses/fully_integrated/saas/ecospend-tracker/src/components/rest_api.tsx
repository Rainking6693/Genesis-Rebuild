import axios from 'axios';

type Props = {
  apiBaseUrl: string;
  onError?: (error: Error) => void;
};

interface ResponseData {
  message: string;
}

const MyComponent: React.FC<Props> = ({ apiBaseUrl, onError }) => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      let response: ResponseData | any;
      try {
        response = await axios.get<ResponseData>(`${apiBaseUrl}/api/message`);
        setMessage(response.data.message);
      } catch (error) {
        if (onError) {
          onError(error);
        }
        console.error(error);
      }
    };

    fetchData();
  }, [apiBaseUrl, onError]);

  if (message === null) {
    return <div>Loading...</div>;
  }

  return <div>{message}</div>;
};

MyComponent.defaultProps = {
  onError: console.error,
};

export default MyComponent;

import axios from 'axios';

type Props = {
  apiBaseUrl: string;
  onError?: (error: Error) => void;
};

interface ResponseData {
  message: string;
}

const MyComponent: React.FC<Props> = ({ apiBaseUrl, onError }) => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      let response: ResponseData | any;
      try {
        response = await axios.get<ResponseData>(`${apiBaseUrl}/api/message`);
        setMessage(response.data.message);
      } catch (error) {
        if (onError) {
          onError(error);
        }
        console.error(error);
      }
    };

    fetchData();
  }, [apiBaseUrl, onError]);

  if (message === null) {
    return <div>Loading...</div>;
  }

  return <div>{message}</div>;
};

MyComponent.defaultProps = {
  onError: console.error,
};

export default MyComponent;