export interface RequestModel {
  url: string;
  method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  body?: Record<string, string> | string;
  headers?: Record<string, string>;
  values?: Record<string, string>;
  executionTime?: number;
}
