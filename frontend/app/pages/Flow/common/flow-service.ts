import type { CreateFlowRequest, ExecuteFlowRequest, ExecuteFlowResponse, Flow, FlowListItem, UpdateFlowRequest } from '~/pages/Flow/common/flow-type';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7777';

export class FlowService {
  static async getAll(): Promise<FlowListItem[]> {
    const response = await fetch(`${API_BASE_URL}/flows/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch flows');
    }

    return response.json();
  }

  static async getById(id: string): Promise<Flow> {
    const response = await fetch(`${API_BASE_URL}/flows/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch flow');
    }

    return response.json();
  }

  static async create(data: CreateFlowRequest): Promise<Flow> {
    const response = await fetch(`${API_BASE_URL}/flows/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create flow');
    }

    return response.json();
  }

  static async update(id: string, data: UpdateFlowRequest): Promise<Flow> {
    const response = await fetch(`${API_BASE_URL}/flows/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update flow');
    }

    return response.json();
  }

  static async delete(id: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/flows/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete flow');
    }

    return true;
  }

  static async execute(id: string, message: ExecuteFlowRequest): Promise<ExecuteFlowResponse> {
    const response = await fetch(`${API_BASE_URL}/flows/${id}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error('Failed to execute flow');
    }

    return response.json();
  }
}