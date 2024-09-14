import axios, { AxiosInstance } from 'axios';

interface IaxiosHelper<T> {
  get: (url: string) => Promise<T[]>;
  post: (url: string, data: T) => Promise<T>;
  update: (url: string, data: T) => Promise<T>;
  delete: (url: string) => Promise<void>; // DELETE requests typically don't return data
}

export class AxiosHelper<T> implements IaxiosHelper<T> {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  }

  async get(url: string): Promise<T[]> {
    const res = await this.axiosInstance.get<T[]>(url);
    return res.data;
  }

  async post(url: string, data: T): Promise<T> {
    const res = await this.axiosInstance.post<T>(url, data);
    return res.data;
  }

  async update(url: string, data: T): Promise<T> {
    const res = await this.axiosInstance.put<T>(url, data);
    return res.data;
  }

  async updateCompleted(url: string, data: T): Promise<T> {
    const res = await this.axiosInstance.patch<T>(url, data);
    return res.data;
  }

  async delete(url: string): Promise<void> {
    await this.axiosInstance.delete(url);
  }
}
