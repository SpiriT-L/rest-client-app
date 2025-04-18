import { describe, it, expect } from 'vitest';
import { codeTemplates } from './codeTemplates';
import { HttpMethod } from '@/models/rest-client';

describe('codeTemplates', () => {
  const mockRequest = {
    method: 'POST' as HttpMethod,
    url: 'https://api.example.com/users',
    headers: [
      { key: 'Content-Type', value: 'application/json' },
      { key: 'Authorization', value: 'Bearer token123' },
    ],
    body: '{"name":"John","age":30}',
  };

  describe('curl', () => {
    it('generates curl command with all parameters', () => {
      const result = codeTemplates.curl(mockRequest);
      expect(result).toContain('curl -X POST');
      expect(result).toContain('https://api.example.com/users');
      expect(result).toContain('-H "Content-Type: application/json"');
      expect(result).toContain('-H "Authorization: Bearer token123"');
      expect(result).toContain('-d \'{"name":"John","age":30}\'');
    });

    it('generates curl command without headers', () => {
      const requestWithoutHeaders = { ...mockRequest, headers: [] };
      const result = codeTemplates.curl(requestWithoutHeaders);
      expect(result).not.toContain('-H');
    });

    it('generates curl command without body', () => {
      const requestWithoutBody = { ...mockRequest, body: '' };
      const result = codeTemplates.curl(requestWithoutBody);
      expect(result).not.toContain('-d');
    });
  });

  describe('javascript', () => {
    it('generates fetch code with all parameters', () => {
      const result = codeTemplates.javascript(mockRequest);
      expect(result).toContain('fetch("https://api.example.com/users"');
      expect(result).toContain('method: "POST"');
      expect(result).toContain('headers: {');
      expect(result).toContain('"Content-Type": "application/json"');
      expect(result).toContain('"Authorization": "Bearer token123"');
      expect(result).toContain('body: {"name":"John","age":30}');
    });

    it('generates fetch code without headers', () => {
      const requestWithoutHeaders = { ...mockRequest, headers: [] };
      const result = codeTemplates.javascript(requestWithoutHeaders);
      expect(result).toContain('headers: {\n\n  }');
    });

    it('generates fetch code without body', () => {
      const requestWithoutBody = { ...mockRequest, body: '' };
      const result = codeTemplates.javascript(requestWithoutBody);
      expect(result).toContain('body: null');
    });
  });

  describe('python', () => {
    it('generates requests code with all parameters', () => {
      const result = codeTemplates.python(mockRequest);
      expect(result).toContain('requests.post("https://api.example.com/users"');
      expect(result).toContain('headers = {');
      expect(result).toContain('"Content-Type": "application/json"');
      expect(result).toContain('"Authorization": "Bearer token123"');
      expect(result).toContain('json={"name":"John","age":30}');
    });

    it('generates requests code without headers', () => {
      const requestWithoutHeaders = { ...mockRequest, headers: [] };
      const result = codeTemplates.python(requestWithoutHeaders);
      expect(result).toContain('headers = {\n\n}');
    });

    it('generates requests code without body', () => {
      const requestWithoutBody = { ...mockRequest, body: '' };
      const result = codeTemplates.python(requestWithoutBody);
      expect(result).not.toContain('json=');
    });
  });

  describe('java', () => {
    it('generates Java code with all parameters', () => {
      const result = codeTemplates.java(mockRequest);
      expect(result).toContain(
        'HttpClient client = HttpClient.newHttpClient();'
      );
      expect(result).toContain(
        'HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()'
      );
      expect(result).toContain(
        '.uri(URI.create("https://api.example.com/users"))'
      );
      expect(result).toContain(
        '.method("POST", BodyPublishers.ofString({"name":"John","age":30}))'
      );
      expect(result).toContain('.header("Content-Type", "application/json")');
      expect(result).toContain('.header("Authorization", "Bearer token123")');
    });

    it('generates Java code without headers', () => {
      const requestWithoutHeaders = { ...mockRequest, headers: [] };
      const result = codeTemplates.java(requestWithoutHeaders);
      expect(result).not.toContain('.header(');
    });

    it('generates Java code without body', () => {
      const requestWithoutBody = { ...mockRequest, body: '' };
      const result = codeTemplates.java(requestWithoutBody);
      expect(result).toContain('.method("POST", BodyPublishers.noBody())');
    });
  });

  describe('csharp', () => {
    it('generates C# code with all parameters', () => {
      const result = codeTemplates.csharp(mockRequest);
      expect(result).toContain('using var client = new HttpClient();');
      expect(result).toContain(
        'client.DefaultRequestHeaders.Add("Content-Type", "application/json")'
      );
      expect(result).toContain(
        'client.DefaultRequestHeaders.Add("Authorization", "Bearer token123")'
      );
      expect(result).toContain(
        'await client.postAsync("https://api.example.com/users"'
      );
      expect(result).toContain(
        'new StringContent({"name":"John","age":30}, Encoding.UTF8, "application/json")'
      );
    });

    it('generates C# code without headers', () => {
      const requestWithoutHeaders = { ...mockRequest, headers: [] };
      const result = codeTemplates.csharp(requestWithoutHeaders);
      expect(result).not.toContain('client.DefaultRequestHeaders.Add');
    });

    it('generates C# code without body', () => {
      const requestWithoutBody = { ...mockRequest, body: '' };
      const result = codeTemplates.csharp(requestWithoutBody);
      expect(result).not.toContain('new StringContent');
    });
  });

  describe('go', () => {
    it('generates Go code with all parameters', () => {
      const result = codeTemplates.go(mockRequest);
      expect(result).toContain('client := &http.Client{}');
      expect(result).toContain(
        'req.Header.Add("Content-Type", "application/json")'
      );
      expect(result).toContain(
        'req.Header.Add("Authorization", "Bearer token123")'
      );
      expect(result).toContain(
        'http.NewRequest("POST", "https://api.example.com/users"'
      );
      expect(result).toContain('strings.NewReader({"name":"John","age":30})');
    });

    it('generates Go code without headers', () => {
      const requestWithoutHeaders = { ...mockRequest, headers: [] };
      const result = codeTemplates.go(requestWithoutHeaders);
      expect(result).not.toContain('req.Header.Add');
    });

    it('generates Go code without body', () => {
      const requestWithoutBody = { ...mockRequest, body: '' };
      const result = codeTemplates.go(requestWithoutBody);
      expect(result).toContain('nil');
    });
  });
});
