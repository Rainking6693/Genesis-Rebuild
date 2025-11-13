import axios, { AxiosError, AxiosResponse } from 'axios';

interface SlackUser {
  id: string;
  name: string;
}

interface SlackMessage {
  user_id: string;
  text: string;
  ts: string;
}

type ApiResponse<T> = T extends AxiosResponse<infer U> ? U : T;

const BASE_URL = 'https://slack.com/api';

async function getAuthHeaders(token: string): Promise<{ Authorization: string }> {
  return { Authorization: `Bearer ${token}` };
}

async function getChannels(token: string, workspaceId: string, pageToken?: string): Promise<ApiResponse<{ channels: Array<{ id: string }> }>> {
  const headers = await getAuthHeaders(token);
  const url = `${BASE_URL}/conversations.list?token=${token}&channel=C${workspaceId}&count=1000${pageToken ? `&cursor=${pageToken}` : ''}`;

  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error fetching channels: ${error.message}`);
      throw error;
    }

    console.error(`Unexpected error fetching channels: ${error}`);
    throw new Error('Unexpected error');
  }
}

async function getMessages(token: string, channelId: string, pageToken?: string): Promise<ApiResponse<{ messages: Array<SlackMessage> }>> {
  const headers = await getAuthHeaders(token);
  const url = `${BASE_URL}/conversations.history?token=${token}&channel=${channelId}&count=1000${pageToken ? `&cursor=${pageToken}` : ''}`;

  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error fetching messages for channel ${channelId}: ${error.message}`);
      throw error;
    }

    console.error(`Unexpected error fetching messages for channel ${channelId}: ${error}`);
    throw new Error('Unexpected error');
  }
}

async function calculateAverageMessagesPerUser(token: string, workspaceId: string): Promise<number> {
  let totalMessages = 0;
  let totalUsers = 0;
  const users: Set<string> = new Set();

  let pageToken: string | null = null;

  do {
    const channelsResponse = await getChannels(token, workspaceId, pageToken);
    const channels = channelsResponse.channels;

    for (const channel of channels) {
      const messagesResponse = await getMessages(token, channel.id, pageToken);
      const messages = messagesResponse.messages;

      for (const message of messages) {
        totalMessages++;
        if (!users.has(message.user_id)) {
          users.add(message.user_id);
          totalUsers++;
        }
      }

      pageToken = messagesResponse.response_metadata?.next_cursor;
    }
  } while (pageToken);

  return totalMessages / totalUsers;
}

import axios, { AxiosError, AxiosResponse } from 'axios';

interface SlackUser {
  id: string;
  name: string;
}

interface SlackMessage {
  user_id: string;
  text: string;
  ts: string;
}

type ApiResponse<T> = T extends AxiosResponse<infer U> ? U : T;

const BASE_URL = 'https://slack.com/api';

async function getAuthHeaders(token: string): Promise<{ Authorization: string }> {
  return { Authorization: `Bearer ${token}` };
}

async function getChannels(token: string, workspaceId: string, pageToken?: string): Promise<ApiResponse<{ channels: Array<{ id: string }> }>> {
  const headers = await getAuthHeaders(token);
  const url = `${BASE_URL}/conversations.list?token=${token}&channel=C${workspaceId}&count=1000${pageToken ? `&cursor=${pageToken}` : ''}`;

  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error fetching channels: ${error.message}`);
      throw error;
    }

    console.error(`Unexpected error fetching channels: ${error}`);
    throw new Error('Unexpected error');
  }
}

async function getMessages(token: string, channelId: string, pageToken?: string): Promise<ApiResponse<{ messages: Array<SlackMessage> }>> {
  const headers = await getAuthHeaders(token);
  const url = `${BASE_URL}/conversations.history?token=${token}&channel=${channelId}&count=1000${pageToken ? `&cursor=${pageToken}` : ''}`;

  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error fetching messages for channel ${channelId}: ${error.message}`);
      throw error;
    }

    console.error(`Unexpected error fetching messages for channel ${channelId}: ${error}`);
    throw new Error('Unexpected error');
  }
}

async function calculateAverageMessagesPerUser(token: string, workspaceId: string): Promise<number> {
  let totalMessages = 0;
  let totalUsers = 0;
  const users: Set<string> = new Set();

  let pageToken: string | null = null;

  do {
    const channelsResponse = await getChannels(token, workspaceId, pageToken);
    const channels = channelsResponse.channels;

    for (const channel of channels) {
      const messagesResponse = await getMessages(token, channel.id, pageToken);
      const messages = messagesResponse.messages;

      for (const message of messages) {
        totalMessages++;
        if (!users.has(message.user_id)) {
          users.add(message.user_id);
          totalUsers++;
        }
      }

      pageToken = messagesResponse.response_metadata?.next_cursor;
    }
  } while (pageToken);

  return totalMessages / totalUsers;
}