import { type Agent, type CreateAgentRequest, type UpdateAgentRequest } from './agent-type';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7777';

export class AgentService {
  static async getAll(): Promise<Agent[]> {
    const response = await fetch(`${API_BASE_URL}/agent`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch agents');
    }

    return response.json();
  }

  static async getById(id: string): Promise<Agent> {
    const response = await fetch(`${API_BASE_URL}/agent/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch agent');
    }

    return response.json();
  }

  static async create(data: CreateAgentRequest): Promise<Agent> {
    const response = await fetch(`${API_BASE_URL}/agent/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create agent');
    }

    return response.json();
  }

  static async update(id: string, data: UpdateAgentRequest): Promise<Agent> {
    const response = await fetch(`${API_BASE_URL}/agent/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update agent');
    }

    return response.json();
  }

  static async delete(id: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/agent/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete agent');
    }

    return true;
  }
}