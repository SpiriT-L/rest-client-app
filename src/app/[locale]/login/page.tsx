'use client';

import styles from './LoginForm.module.scss';
import { useFormik } from 'formik';
import { getLoginValidationSchema } from '@/utils/validationSchema';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { useTranslations } from 'next-intl';
import { JSX } from 'react';

export default function LoginPage(): JSX.Element {
  const t = useTranslations('Login');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: getLoginValidationSchema(t),
    validateOnMount: true,
    onSubmit: async values => {
      try {
        console.log('Login:', values);
      } catch (err) {
        console.error('Error during login:', err);
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

        <Button type="submit" disabled={!formik.isValid || formik.isSubmitting}>
          {t('buttons.login')}
        </Button>
      </form>
    </div>
  );
}
