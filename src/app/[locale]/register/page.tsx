'use client';

import styles from './RegisterForm.module.scss';
import { useFormik } from 'formik';
import { getValidationSchema } from '@/utils/validationSchema';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { useTranslations } from 'next-intl';
import { JSX, useEffect, useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import { useRouter } from 'next/navigation';
import { guestCheck } from '@/hocs/guestCheck';

const RegisterForm: React.FC = () => {
  const t = useTranslations('Register');
  const router = useRouter();
  const [emailError, setEmailError] = useState<string | undefined>(undefined);

  const [
    createUserWithEmailAndPassword,
    userCredential,
    loading,
    firebaseError,
  ] = useCreateUserWithEmailAndPassword(auth);

  useEffect(() => {
    if (firebaseError) {
      setEmailError(firebaseError.message);
    } else {
      setEmailError(undefined);
    }
  }, [firebaseError]);

  useEffect(() => {
    if (userCredential) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 3000);
      return (): void => clearTimeout(timer);
    }
  }, [userCredential, router]);

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
      await createUserWithEmailAndPassword(values.email, values.password);
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
          error={emailError || formik.errors.email}
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

        <Button
          type="submit"
          disabled={!formik.isValid || formik.isSubmitting || loading}
        >
          {t('buttons.register')}
        </Button>
      </form>
      {userCredential && <p className={styles.success}>{t('success')}</p>}
    </div>
  );
};

const GuestRegisterForm = guestCheck(RegisterForm);

export default function RegisterPage(): JSX.Element {
  return <GuestRegisterForm />;
}
