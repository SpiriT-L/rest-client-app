import { describe, it, expect, vi } from 'vitest';
import {
  getValidationSchema,
  getLoginValidationSchema,
} from './validationSchema';

describe('Validation Schema', () => {
  const mockT = vi.fn((key: string) => key);

  describe('Registration Schema', () => {
    const schema = getValidationSchema(mockT);

    it('validates correct registration data', async () => {
      const validData = {
        email: 'test@example.com',
        password: 'Test123!@#',
        repeatPassword: 'Test123!@#',
        accepted: true,
      };

      await expect(schema.validate(validData)).resolves.toEqual(validData);
    });

    it('rejects invalid email format', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Test123!@#',
        repeatPassword: 'Test123!@#',
        accepted: true,
      };

      await expect(schema.validate(invalidData)).rejects.toThrow(
        'validation.email'
      );
    });

    it('rejects short password', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Test1!',
        repeatPassword: 'Test1!',
        accepted: true,
      };

      await expect(schema.validate(invalidData)).rejects.toThrow(
        'validation.passwordMinLength'
      );
    });

    it('rejects password without letters', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: '12345678!',
        repeatPassword: '12345678!',
        accepted: true,
      };

      await expect(schema.validate(invalidData)).rejects.toThrow(
        'validation.passwordLetter'
      );
    });

    it('rejects password without digits', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'TestTest!',
        repeatPassword: 'TestTest!',
        accepted: true,
      };

      await expect(schema.validate(invalidData)).rejects.toThrow(
        'validation.passwordDigit'
      );
    });

    it('rejects password without special characters', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Test12345',
        repeatPassword: 'Test12345',
        accepted: true,
      };

      await expect(schema.validate(invalidData)).rejects.toThrow(
        'validation.passwordSpecial'
      );
    });

    it('rejects mismatched passwords', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Test123!@#',
        repeatPassword: 'Different123!@#',
        accepted: true,
      };

      await expect(schema.validate(invalidData)).rejects.toThrow(
        'validation.passwordsMustMatch'
      );
    });

    it('rejects unaccepted terms', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Test123!@#',
        repeatPassword: 'Test123!@#',
        accepted: false,
      };

      await expect(schema.validate(invalidData)).rejects.toThrow(
        'validation.acceptTerms'
      );
    });

    it('rejects missing required fields', async () => {
      const invalidData = {
        email: '',
        password: '',
        repeatPassword: '',
        accepted: false,
      };

      await expect(schema.validate(invalidData)).rejects.toThrow();
    });
  });

  describe('Login Schema', () => {
    const schema = getLoginValidationSchema(mockT);

    it('validates correct login data', async () => {
      const validData = {
        email: 'test@example.com',
        password: 'Test123!@#',
      };

      await expect(schema.validate(validData)).resolves.toEqual(validData);
    });

    it('rejects invalid email format', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Test123!@#',
      };

      await expect(schema.validate(invalidData)).rejects.toThrow(
        'validation.email'
      );
    });

    it('rejects short password', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Test1',
      };

      await expect(schema.validate(invalidData)).rejects.toThrow(
        'validation.passwordMinLength'
      );
    });

    it('rejects missing required fields', async () => {
      const invalidData = {
        email: '',
        password: '',
      };

      await expect(schema.validate(invalidData)).rejects.toThrow();
    });

    it('accepts valid email with subdomain', async () => {
      const validData = {
        email: 'test@sub.example.com',
        password: 'Test123!@#',
      };

      await expect(schema.validate(validData)).resolves.toEqual(validData);
    });

    it('accepts valid email with numbers', async () => {
      const validData = {
        email: 'test123@example.com',
        password: 'Test123!@#',
      };

      await expect(schema.validate(validData)).resolves.toEqual(validData);
    });

    it('accepts valid email with special characters', async () => {
      const validData = {
        email: 'test.user+label@example.com',
        password: 'Test123!@#',
      };

      await expect(schema.validate(validData)).resolves.toEqual(validData);
    });
  });
});
