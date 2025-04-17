export interface RequestModel {
  url: string;
  method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
  body?: Record<string, string>;
  headers?: Record<string, string>;
  values?: Record<string, string>;
  executionTime?: number;
}
