import { type Api, type CreateApiRequest, type UpdateApiRequest } from '~/pages/Api/common/api-type';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7777';

export class ApiService {
  static async getAll(): Promise<Api[]> {
    const response = await fetch(`${API_BASE_URL}/api/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch APIs');
    }

    return response.json();
  }

  static async getById(id: string): Promise<Api> {
    const response = await fetch(`${API_BASE_URL}/api/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch API');
    }

    return response.json();
  }

  static async create(data: CreateApiRequest): Promise<Api> {
    const response = await fetch(`${API_BASE_URL}/api/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create API');
    }

    return response.json();
  }

  static async update(id: string, data: UpdateApiRequest): Promise<Api> {
    const response = await fetch(`${API_BASE_URL}/api/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update API');
    }

    return response.json();
  }

  static async delete(id: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/api/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete API');
    }

    return true;
  }
}