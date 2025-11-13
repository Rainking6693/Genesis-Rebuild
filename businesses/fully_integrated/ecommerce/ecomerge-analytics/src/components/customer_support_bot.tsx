import { Message, User } from './user';
import axios from 'axios';

interface OrderStatus {
  id: number;
  status: string;
}

interface ReturnStatus {
  id: number;
  status: string;
}

interface Product {
  id: number;
  name: string;
}

interface ResponseData {
  orderStatus: OrderStatus | null;
  returnStatus: ReturnStatus | null;
  products: Product[];
}

const customerSupportBot = async (userId: number, inquiry: string): Promise<Message> => {
  const user = getUser(userId);

  if (!user) {
    return { text: 'User not found.' };
  }

  try {
    const response = await axios.post('/api/inquiry', { userId, inquiry });
    const data: ResponseData = response.data;

    let messageText = '';

    if (data.orderStatus) {
      messageText += `Your order #${data.orderStatus.id} is currently ${data.orderStatus.status}.\n`;
    }

    if (data.returnStatus) {
      messageText += `Your return #${data.returnStatus.id} is currently ${data.returnStatus.status}.\n`;
    }

    if (data.products.length > 0) {
      messageText += 'Here are the products you have in your cart:\n';
      data.products.forEach((product, index) => {
        messageText += `${index + 1}. ${product.name}\n`;
      });
    }

    if (messageText.length === 0) {
      messageText = 'I couldn't find any information related to your inquiry. Please try again.';
    }

    return { text: messageText };
  } catch (error) {
    console.error(error);
    return { text: 'An error occurred while processing your request. Please try again later.' };
  }
};

const getUser = (userId: number): User | null => {
  // Implement the logic to fetch the user from the database or cache
  // ...
  // Return the user object or null if not found
  // ...
};

export default customerSupportBot;

import { Message, User } from './user';
import axios from 'axios';

interface OrderStatus {
  id: number;
  status: string;
}

interface ReturnStatus {
  id: number;
  status: string;
}

interface Product {
  id: number;
  name: string;
}

interface ResponseData {
  orderStatus: OrderStatus | null;
  returnStatus: ReturnStatus | null;
  products: Product[];
}

const customerSupportBot = async (userId: number, inquiry: string): Promise<Message> => {
  const user = getUser(userId);

  if (!user) {
    return { text: 'User not found.' };
  }

  try {
    const response = await axios.post('/api/inquiry', { userId, inquiry });
    const data: ResponseData = response.data;

    let messageText = '';

    if (data.orderStatus) {
      messageText += `Your order #${data.orderStatus.id} is currently ${data.orderStatus.status}.\n`;
    }

    if (data.returnStatus) {
      messageText += `Your return #${data.returnStatus.id} is currently ${data.returnStatus.status}.\n`;
    }

    if (data.products.length > 0) {
      messageText += 'Here are the products you have in your cart:\n';
      data.products.forEach((product, index) => {
        messageText += `${index + 1}. ${product.name}\n`;
      });
    }

    if (messageText.length === 0) {
      messageText = 'I couldn't find any information related to your inquiry. Please try again.';
    }

    return { text: messageText };
  } catch (error) {
    console.error(error);
    return { text: 'An error occurred while processing your request. Please try again later.' };
  }
};

const getUser = (userId: number): User | null => {
  // Implement the logic to fetch the user from the database or cache
  // ...
  // Return the user object or null if not found
  // ...
};

export default customerSupportBot;