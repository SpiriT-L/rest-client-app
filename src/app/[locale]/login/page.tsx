'use client';

import styles from './LoginForm.module.scss';
import { useFormik } from 'formik';
import { getLoginValidationSchema } from '@/utils/validationSchema';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { useTranslations } from 'next-intl';
import { JSX, useEffect, useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { guestCheck } from '@/hocs/guestCheck';

const LoginForm: React.FC = () => {
  const t = useTranslations('Login');
  const router = useRouter();
  const [firebaseError, setFirebaseError] = useState<string | undefined>(
    undefined
  );

  const [signInWithEmailAndPassword, userCredential, loading, error] =
    useSignInWithEmailAndPassword(auth);

  useEffect(() => {
    if (error) {
      setFirebaseError(error.message);
    } else {
      setFirebaseError(undefined);
    }
  }, [error]);

  useEffect(() => {
    if (userCredential) {
      router.push('/');
    }
  }, [userCredential, router]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: getLoginValidationSchema(t),
    validateOnMount: true,
    onSubmit: async values => {
      await signInWithEmailAndPassword(values.email, values.password);
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
          error={firebaseError || formik.errors.email}
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

        <Button
          type="submit"
          disabled={!formik.isValid || formik.isSubmitting || loading}
        >
          {t('buttons.login')}
        </Button>
        <div className={styles.linkContainer}>
          {t('no_account')}
          <Link href="/register">{t('sign_up')}</Link>
        </div>
      </form>
    </div>
  );
};

const GuestLoginForm = guestCheck(LoginForm);

export default function LoginPage(): JSX.Element {
  return <GuestLoginForm />;
}
