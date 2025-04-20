import * as Yup from 'yup';

export const getValidationSchema = (
  t: (key: string) => string
): Yup.ObjectSchema<{
  email: string;
  password: string;
  repeatPassword: string;
  accepted: boolean;
}> =>
  Yup.object({
    email: Yup.string()
      .email(t('validation.email'))
      .required(t('validation.requiredEmail'))
      .matches(
        RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
        'validation.emailInvalid'
      ),
    password: Yup.string()
      .min(8, t('validation.passwordMinLength'))
      .required(t('validation.requiredPassword'))
      .matches(/\p{L}/u, t('validation.passwordLetter'))
      .matches(/\d/, t('validation.passwordDigit'))
      .matches(
        /[!@#$%^&*(),.?":{}|<>[\];'~`\-_/\\=+\s]/,
        t('validation.passwordSpecial')
      ),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('validation.passwordsMustMatch'))
      .required(t('validation.requiredRepeatPassword')),
    accepted: Yup.boolean()
      .oneOf([true], t('validation.acceptTerms'))
      .required(t('validation.requiredAcceptTerms')),
  });

export const getLoginValidationSchema = (
  t: (key: string) => string
): Yup.ObjectSchema<{
  email: string;
  password: string;
}> =>
  Yup.object({
    email: Yup.string()
      .email(t('validation.email'))
      .required(t('validation.requiredEmail')),
    password: Yup.string()
      .min(8, t('validation.passwordMinLength'))
      .required(t('validation.requiredPassword')),
  });
