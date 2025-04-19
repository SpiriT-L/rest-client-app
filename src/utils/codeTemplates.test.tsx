import { describe, it, expect } from 'vitest';
import { codeTemplates } from './codeTemplates';
import { HttpMethod } from '@/models/rest-client';

describe('codeTemplates', () => {
  const mockParams = {
    method: 'GET' as HttpMethod,
    url: 'https://api.example.com',
    headers: [
      { key: 'Content-Type', value: 'application/json' },
      { key: 'Authorization', value: 'Bearer token' },
    ],
    body: '{"test":"value"}',
  };

  describe('curl', () => {
    it('generates curl command with all parameters', () => {
      const result = codeTemplates.curl(mockParams);
      expect(result).toBe(
        'curl -X GET "https://api.example.com" -H "Content-Type: application/json" -H "Authorization: Bearer token" -d \'{"test":"value"}\''
      );
    });

    it('generates curl command without headers', () => {
      const params = { ...mockParams, headers: [] };
      const result = codeTemplates.curl(params);
      expect(result).toBe(
        'curl -X GET "https://api.example.com" -d \'{"test":"value"}\''
      );
    });

    it('generates curl command without body', () => {
      const params = { ...mockParams, body: undefined };
      const result = codeTemplates.curl(params);
      expect(result).toBe(
        'curl -X GET "https://api.example.com" -H "Content-Type: application/json" -H "Authorization: Bearer token"'
      );
    });
  });

  describe('javascript', () => {
    it('generates fetch code with all parameters', () => {
      const result = codeTemplates.javascript(mockParams);
      expect(result).toContain('fetch("https://api.example.com"');
      expect(result).toContain('method: "GET"');
      expect(result).toContain('"Content-Type": "application/json"');
      expect(result).toContain('"Authorization": "Bearer token"');
      expect(result).toContain('body: {"test":"value"}');
    });

    it('generates fetch code without headers', () => {
      const params = { ...mockParams, headers: [] };
      const result = codeTemplates.javascript(params);
      expect(result).not.toContain('headers: {');
    });

    it('generates fetch code without body', () => {
      const params = { ...mockParams, body: undefined };
      const result = codeTemplates.javascript(params);
      expect(result).toContain('body: null');
    });
  });

  describe('xhr', () => {
    it('generates XHR code with all parameters', () => {
      const result = codeTemplates.xhr(mockParams);
      expect(result).toContain('xhr.open("GET", "https://api.example.com")');
      expect(result).toContain(
        'xhr.setRequestHeader("Content-Type", "application/json")'
      );
      expect(result).toContain(
        'xhr.setRequestHeader("Authorization", "Bearer token")'
      );
      expect(result).toContain('xhr.send({"test":"value"})');
    });

    it('generates XHR code without headers', () => {
      const params = { ...mockParams, headers: [] };
      const result = codeTemplates.xhr(params);
      expect(result).not.toContain('xhr.setRequestHeader');
    });

    it('generates XHR code without body', () => {
      const params = { ...mockParams, body: undefined };
      const result = codeTemplates.xhr(params);
      expect(result).toContain('xhr.send();');
    });
  });

  describe('nodejs', () => {
    it('generates Node.js code with all parameters', () => {
      const result = codeTemplates.nodejs(mockParams);
      expect(result).toContain('"Content-Type": "application/json"');
      expect(result).toContain('"Authorization": "Bearer token"');
      expect(result).toContain('req.write({"test":"value"})');
    });

    it('generates Node.js code without headers', () => {
      const params = { ...mockParams, headers: [] };
      const result = codeTemplates.nodejs(params);
      expect(result).not.toContain('headers: {');
    });

    it('generates Node.js code without body', () => {
      const params = { ...mockParams, body: undefined };
      const result = codeTemplates.nodejs(params);
      expect(result).not.toContain('req.write(');
    });
  });

  describe('python', () => {
    it('generates Python code with all parameters', () => {
      const result = codeTemplates.python(mockParams);
      expect(result).toContain('requests.get("https://api.example.com"');
      expect(result).toContain('"Content-Type": "application/json"');
      expect(result).toContain('"Authorization": "Bearer token"');
      expect(result).toContain(', json={"test":"value"}');
    });

    it('generates Python code without headers', () => {
      const params = { ...mockParams, headers: [] };
      const result = codeTemplates.python(params);
      expect(result).not.toContain('headers = {');
    });

    it('generates Python code without body', () => {
      const params = { ...mockParams, body: undefined };
      const result = codeTemplates.python(params);
      expect(result).not.toContain(', json=');
    });
  });

  describe('java', () => {
    it('generates Java code with all parameters', () => {
      const result = codeTemplates.java(mockParams);
      expect(result).toContain('.uri(URI.create("https://api.example.com"))');
      expect(result).toContain('.method("GET"');
      expect(result).toContain(
        'requestBuilder.header("Content-Type", "application/json")'
      );
      expect(result).toContain(
        'requestBuilder.header("Authorization", "Bearer token")'
      );
      expect(result).toContain('BodyPublishers.ofString({"test":"value"})');
    });

    it('generates Java code without headers', () => {
      const params = { ...mockParams, headers: [] };
      const result = codeTemplates.java(params);
      expect(result).not.toContain('requestBuilder.header');
    });

    it('generates Java code without body', () => {
      const params = { ...mockParams, body: undefined };
      const result = codeTemplates.java(params);
      expect(result).toContain('BodyPublishers.noBody()');
    });
  });

  describe('csharp', () => {
    it('generates C# code without headers', () => {
      const params = { ...mockParams, headers: [] };
      const result = codeTemplates.csharp(params);
      expect(result).not.toContain('client.DefaultRequestHeaders.Add');
    });

    it('generates C# code without body', () => {
      const params = { ...mockParams, body: undefined };
      const result = codeTemplates.csharp(params);
      expect(result).not.toContain('new StringContent');
    });
  });

  describe('go', () => {
    it('generates Go code with all parameters', () => {
      const result = codeTemplates.go(mockParams);
      expect(result).toContain(
        'http.NewRequest("GET", "https://api.example.com"'
      );
      expect(result).toContain(
        'req.Header.Add("Content-Type", "application/json")'
      );
      expect(result).toContain(
        'req.Header.Add("Authorization", "Bearer token")'
      );
      expect(result).toContain('strings.NewReader({"test":"value"})');
    });

    it('generates Go code without headers', () => {
      const params = { ...mockParams, headers: [] };
      const result = codeTemplates.go(params);
      expect(result).not.toContain('req.Header.Add');
    });

    it('generates Go code without body', () => {
      const params = { ...mockParams, body: undefined };
      const result = codeTemplates.go(params);
      expect(result).toContain('nil');
    });
  });
});
