import { render, screen } from '@testing-library/react';
import { vi, beforeEach, describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import RegisterPage from './page';
import { useFormik } from 'formik';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({ currentUser: null })),
  getApp: vi.fn(() => ({ name: '[DEFAULT]' })),
  initializeApp: vi.fn(() => ({ name: '[DEFAULT]' })),
  getApps: vi.fn(() => []),
}));

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => key),
}));

vi.mock('react-firebase-hooks/auth', () => ({
  useCreateUserWithEmailAndPassword: vi.fn(() => [vi.fn(), null, false, null]),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

const mockFormikValues = {
  email: '',
  password: '',
  repeatPassword: '',
  accepted: false,
};

const mockHandleChange = vi.fn(e => {
  const { name, value, type, checked } = e.target;
  Object.assign(mockFormikValues, {
    [name]: type === 'checkbox' ? checked : value,
  });
});

const mockHandleSubmit = vi.fn(e => {
  e.preventDefault();
  return mockFormikValues;
});

const createMockFormikBag = (overrides = {}) => ({
  initialValues: mockFormikValues,
  initialErrors: {},
  initialTouched: {},
  initialStatus: undefined,
  handleBlur: vi.fn(),
  handleChange: mockHandleChange,
  handleReset: vi.fn(),
  handleSubmit: mockHandleSubmit,
  resetForm: vi.fn(),
  setErrors: vi.fn(),
  setFormikState: vi.fn(),
  setFieldTouched: vi.fn(),
  setFieldValue: vi.fn(),
  setFieldError: vi.fn(),
  setStatus: vi.fn(),
  setSubmitting: vi.fn(),
  setTouched: vi.fn(),
  setValues: vi.fn(),
  submitForm: vi.fn(),
  validateForm: vi.fn(),
  validateField: vi.fn(),
  isValid: true,
  isValidating: false,
  isSubmitting: false,
  dirty: false,
  unregisterField: vi.fn(),
  registerField: vi.fn(),
  getFieldProps: vi.fn(),
  getFieldMeta: vi.fn(),
  getFieldHelpers: vi.fn(),
  validateOnBlur: true,
  validateOnChange: true,
  validateOnMount: false,
  values: mockFormikValues,
  errors: {},
  touched: {},
  status: undefined,
  submitCount: 0,
  ...overrides,
});

vi.mock('formik', () => ({
  useFormik: vi.fn(() => createMockFormikBag()),
  getValidationSchema: vi.fn(() => ({})),
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(mockFormikValues, {
      email: '',
      password: '',
      repeatPassword: '',
      accepted: false,
    });
  });

  it('renders registration form', () => {
    render(<RegisterPage />);
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('placeholders.email')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('placeholders.password')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('placeholders.repeatPassword')
    ).toBeInTheDocument();
    expect(screen.getByText('buttons.register')).toBeInTheDocument();
  });

  it('shows validation error when form is invalid', async () => {
    const mockErrors = {
      email: 'errors.invalidEmail',
      password: 'errors.passwordTooShort',
      repeatPassword: 'errors.passwordsDoNotMatch',
      accepted: 'errors.termsNotAccepted',
    };

    vi.mocked(useFormik).mockReturnValue(
      createMockFormikBag({
        errors: mockErrors,
        touched: {
          email: true,
          password: true,
          repeatPassword: true,
          accepted: true,
        },
        isValid: false,
      })
    );

    render(<RegisterPage />);

    expect(screen.getByText('errors.invalidEmail')).toBeInTheDocument();
    expect(screen.getByText('errors.passwordTooShort')).toBeInTheDocument();
    expect(screen.getByText('errors.passwordsDoNotMatch')).toBeInTheDocument();
    expect(screen.getByText('errors.termsNotAccepted')).toBeInTheDocument();
  });
});
