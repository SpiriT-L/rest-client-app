'use client';

import styles from './RegisterForm.module.scss';
import { useState } from 'react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    if (!email || !password || !repeatPassword) {
      return setError('Заполните все поля');
    }
    if (password !== repeatPassword) {
      return setError('Пароли не совпадают');
    }
    if (!accepted) {
      return setError('Вы должны принять условия');
    }

    try {
      // Тут будет логика регистрации через Firebase
      console.log('Регистрация:', { email, password });
    } catch (err) {
      setError('Ошибка регистрации');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>Регистрация</h1>

      <input
        className={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        className={styles.input}
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <input
        className={styles.input}
        type="password"
        placeholder="Повторите пароль"
        value={repeatPassword}
        onChange={e => setRepeatPassword(e.target.value)}
      />

      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={accepted}
          onChange={e => setAccepted(e.target.checked)}
        />
        <span>Принимаю условия</span>
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <button className={styles.button} onClick={handleRegister}>
        Зарегистрироваться
      </button>
    </div>
  );
}
