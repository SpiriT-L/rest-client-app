import { describe, it, expect } from 'vitest';
import {
  substituteVariables,
  hasVariables,
  extractVariableNames,
} from './variableSubstitution';

describe('variableSubstitution', () => {
  const mockVariables = [
    { key: 'apiUrl', value: 'api.example.com' },
    { key: 'token', value: 'secret123' },
    { key: 'userId', value: '42' },
  ];

  describe('substituteVariables', () => {
    it('returns original text when no variables are present', () => {
      const text = 'https://example.com';
      expect(substituteVariables(text, mockVariables)).toBe(text);
    });

    it('returns original text when variables array is empty', () => {
      const text = 'https://{{apiUrl}}/users';
      expect(substituteVariables(text, [])).toBe(text);
    });

    it('substitutes single variable', () => {
      const text = 'https://{{apiUrl}}/users';
      expect(substituteVariables(text, mockVariables)).toBe(
        'https://api.example.com/users'
      );
    });

    it('substitutes multiple variables', () => {
      const text = 'https://{{apiUrl}}/users/{{userId}}?token={{token}}';
      expect(substituteVariables(text, mockVariables)).toBe(
        'https://api.example.com/users/42?token=secret123'
      );
    });

    it('keeps unmatched variables in the text', () => {
      const text = 'https://{{apiUrl}}/users/{{unknown}}';
      expect(substituteVariables(text, mockVariables)).toBe(
        'https://api.example.com/users/{{unknown}}'
      );
    });

    it('handles empty text', () => {
      expect(substituteVariables('', mockVariables)).toBe('');
    });

    it('handles text with only variables', () => {
      const text = '{{apiUrl}}{{token}}';
      expect(substituteVariables(text, mockVariables)).toBe(
        'api.example.comsecret123'
      );
    });
  });

  describe('hasVariables', () => {
    it('returns false for text without variables', () => {
      expect(hasVariables('https://example.com')).toBe(false);
    });

    it('returns true for text with variables', () => {
      expect(hasVariables('https://{{apiUrl}}/users')).toBe(true);
    });

    it('returns false for empty text', () => {
      expect(hasVariables('')).toBe(false);
    });

    it('returns true for text with multiple variables', () => {
      expect(hasVariables('{{apiUrl}}/users/{{userId}}')).toBe(true);
    });

    it('returns true for text with invalid variable syntax', () => {
      expect(hasVariables('{{apiUrl/users}}')).toBe(true);
    });
  });

  describe('extractVariableNames', () => {
    it('returns empty array for text without variables', () => {
      expect(extractVariableNames('https://example.com')).toEqual([]);
    });

    it('extracts single variable name', () => {
      expect(extractVariableNames('https://{{apiUrl}}/users')).toEqual([
        'apiUrl',
      ]);
    });

    it('extracts multiple variable names', () => {
      expect(extractVariableNames('{{apiUrl}}/users/{{userId}}')).toEqual([
        'apiUrl',
        'userId',
      ]);
    });

    it('returns empty array for empty text', () => {
      expect(extractVariableNames('')).toEqual([]);
    });

    it('extracts variable names with special characters', () => {
      expect(extractVariableNames('{{api-url}}/{{user_id}}')).toEqual([
        'api-url',
        'user_id',
      ]);
    });

    it('handles text with invalid variable syntax', () => {
      expect(extractVariableNames('{{apiUrl/users}}')).toEqual([
        'apiUrl/users',
      ]);
    });
  });
});
