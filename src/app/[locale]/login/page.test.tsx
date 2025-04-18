import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import { useTranslations } from 'next-intl';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';

vi.mock('@/firebase/config', () => ({
  auth: {},
}));

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

vi.mock('react-firebase-hooks/auth', () => ({
  useSignInWithEmailAndPassword: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/utils/validationSchema', () => ({
  getLoginValidationSchema: (
    t: (key: string) => string
  ): Yup.ObjectSchema<object> =>
    Yup.object({
      email: Yup.string()
        .email(t('validation.email.invalid'))
        .required(t('validation.email.required')),
      password: Yup.string()
        .min(6, t('validation.password.min'))
        .required(t('validation.password.required')),
    }),
}));

describe('LoginPage', () => {
  type TranslationType = {
    title: string;
    placeholders: {
      email: string;
      password: string;
    };
    buttons: {
      login: string;
    };
    validation: {
      email: {
        required: string;
        invalid: string;
      };
      password: {
        required: string;
        min: string;
      };
    };
  };

  const mockTranslations: TranslationType = {
    title: 'Login',
    placeholders: {
      email: 'Email',
      password: 'Password',
    },
    buttons: {
      login: 'Sign In',
    },
    validation: {
      email: {
        required: 'Email is required',
        invalid: 'Invalid email format',
      },
      password: {
        required: 'Password is required',
        min: 'Password must be at least 6 characters',
      },
    },
  };

  const mockRouter = {
    push: vi.fn(),
  };

  const mockSignIn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useTranslations.mockReturnValue((key: string) => {
      const keys = key.split('.');
      let value = mockTranslations;
      for (const k of keys) {
        value = value[k];
      }
      return value;
    });

    useRouter.mockReturnValue(mockRouter);

    useSignInWithEmailAndPassword.mockReturnValue([
      mockSignIn,
      null,
      false,
      null,
    ]);
  });

  it('renders login form with all fields', () => {
    render(<LoginPage />);

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<LoginPage />);

    const submitButton = screen.getByText('Sign In');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessages = screen.getAllByRole('alert');
      expect(errorMessages).toHaveLength(2);
      expect(errorMessages[0]).toHaveTextContent('Email is required');
      expect(errorMessages[1]).toHaveTextContent('Password is required');
    });
  });

  it('validates email format', async () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('Invalid email format');
    });
  });

  it('validates password length', async () => {
    render(<LoginPage />);

    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent(
        'Password must be at least 6 characters'
      );
    });
  });

  it('submits form with valid credentials', async () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const submitButton = screen.getByText('Sign In');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
    });
  });

  it('shows firebase error message', async () => {
    useSignInWithEmailAndPassword.mockReturnValue([
      mockSignIn,
      null,
      false,
      { message: 'Invalid credentials' },
    ]);

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.blur(emailInput);

    const submitButton = screen.getByText('Sign In');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('Invalid credentials');
    });
  });

  it('redirects to home page on successful login', async () => {
    useSignInWithEmailAndPassword.mockReturnValue([
      mockSignIn,
      { user: { uid: '123' } },
      false,
      null,
    ]);

    render(<LoginPage />);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
  });

  it('disables submit button while loading', () => {
    useSignInWithEmailAndPassword.mockReturnValue([
      mockSignIn,
      null,
      true,
      null,
    ]);

    render(<LoginPage />);

    const submitButton = screen.getByText('Sign In');
    expect(submitButton).toBeDisabled();
  });
});
