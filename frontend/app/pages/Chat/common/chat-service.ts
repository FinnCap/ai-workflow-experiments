import type { Chat, CreateChatRequest } from "~/pages/Chat/common/chat-type";
import { type Message, type SendMessageRequest } from "~/pages/Chat/common/message-type";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7777';

export class ChatService {
  static async getAllChats(agentId?: string): Promise<Chat[]> {
    const url = agentId
      ? `${API_BASE_URL}/chat/agent/${agentId}`
      : `${API_BASE_URL}/chat/`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chats');
    }

    return response.json();
  }

  static async getChatById(id: string): Promise<Chat> {
    const response = await fetch(`${API_BASE_URL}/chat/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chat');
    }

    return response.json();
  }

  static async createChat(data: CreateChatRequest): Promise<Chat> {
    const response = await fetch(`${API_BASE_URL}/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create chat');
    }

    return response.json();
  }

  static async updateChat(id: string, title: string): Promise<Chat> {
    const response = await fetch(`${API_BASE_URL}/chat/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error('Failed to update chat');
    }

    return response.json();
  }

  static async deleteChat(id: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/chat/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete chat');
    }

    return true;
  }

  static async sendMessage(chatId: string, message: SendMessageRequest): Promise<Message[]> {
    // Validate PDF data before sending
    if (message.pdf_data && message.pdf_data.length > 0) {
      for (const pdf of message.pdf_data) {
        // Validate media type
        if (pdf.media_type !== 'application/pdf') {
          throw new Error(`Unsupported file type: ${pdf.media_type}. Only PDF files are supported.`);
        }

        // Validate base64 content
        if (!pdf.data || !pdf.data.trim()) {
          throw new Error(`PDF ${pdf.file_name || 'file'} has no content.`);
        }

        // Basic validation of base64 format
        try {
          atob(pdf.data);
        } catch (error) {
          throw new Error(`PDF ${pdf.file_name || 'file'} has invalid base64 encoding.`);
        }
      }
    }

    const response = await fetch(`${API_BASE_URL}/chat/${chatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to send message');
    }

    return response.json();
  }

  static async getMessages(chatId: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/chat/${chatId}/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return response.json();
  }

  /**
   * Helper method to validate PDF file before processing
   */
  static validatePdfFile(file: File): string[] {
    const errors: string[] = [];

    if (file.type !== 'application/pdf') {
      errors.push(`${file.name} is not a PDF file`);
    }

    if (file.size > 10 * 1024 * 1024) {
      errors.push(`${file.name} exceeds 10MB size limit`);
    }

    if (file.size === 0) {
      errors.push(`${file.name} is empty`);
    }

    return errors;
  }

  /**
   * Helper method to convert file to base64
   */
  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (data:application/pdf;base64,)
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
      reader.readAsDataURL(file);
    });
  }
}