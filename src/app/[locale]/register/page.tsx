'use client';

import styles from './RegisterForm.module.scss';
import { useFormik } from 'formik';
import { getValidationSchema } from '@/utils/validationSchema';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { useTranslations } from 'next-intl';
import { JSX } from 'react';

export default function RegisterPage(): JSX.Element {
  const t = useTranslations('Register');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      repeatPassword: '',
      accepted: false,
    },
    validationSchema: getValidationSchema(t),
    validateOnMount: true,
    onSubmit: async values => {
      try {
        console.log('Registr:', values);
      } catch (err) {
        console.error('Error during registration:', err);
      }
    },
  });

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>{t('title')}</h1>

      <form onSubmit={formik.handleSubmit}>
        <Input
          type="email"
          name="email"
          placeholder={t('placeholders.email')}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.email}
          touched={formik.touched.email}
        />

        <Input
          type="password"
          name="password"
          placeholder={t('placeholders.password')}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.password}
          touched={formik.touched.password}
        />

        <Input
          type="password"
          name="repeatPassword"
          placeholder={t('placeholders.repeatPassword')}
          value={formik.values.repeatPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.repeatPassword}
          touched={formik.touched.repeatPassword}
        />

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            name="accepted"
            checked={formik.values.accepted}
            onChange={formik.handleChange}
          />
          <span>{t('placeholders.acceptTerms')}</span>
        </label>
        {formik.touched.accepted && formik.errors.accepted && (
          <p className={styles.error}>{formik.errors.accepted}</p>
        )}

        <Button type="submit" disabled={!formik.isValid || formik.isSubmitting}>
          {t('buttons.register')}
        </Button>
      </form>
    </div>
  );
}
