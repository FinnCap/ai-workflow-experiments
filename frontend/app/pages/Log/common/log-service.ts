import type { ChatLogResponse, FlowLogDetailResponse, FlowLogResponse } from "./log-type";


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7777';

export class LogService {
  static async getAllChatLogs(): Promise<ChatLogResponse[]> {
    const response = await fetch(`${API_BASE_URL}/logs/chat`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chat logs');
    }

    return response.json();
  }

  static async getAllFlowLogs(): Promise<FlowLogResponse[]> {
    const response = await fetch(`${API_BASE_URL}/logs/flow`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch flow logs');
    }

    return response.json();
  }

  static async getFlowLogDetails(flowExecutionId: string): Promise<FlowLogDetailResponse> {
    const response = await fetch(`${API_BASE_URL}/logs/flow/${flowExecutionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch flow log details');
    }

    return response.json();
  }
}