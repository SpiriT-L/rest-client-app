import * as Yup from 'yup';

export const getValidationSchema = (t: (key: string) => string) =>
  Yup.object({
    email: Yup.string()
      .email(t('validation.email'))
      .required(t('validation.requiredEmail')),
    password: Yup.string()
      .min(6, t('validation.passwordMinLength'))
      .required(t('validation.requiredPassword')),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('validation.passwordsMustMatch'))
      .required(t('validation.requiredRepeatPassword')),
    accepted: Yup.boolean()
      .oneOf([true], t('validation.acceptTerms'))
      .required(t('validation.requiredAcceptTerms')),
  });
