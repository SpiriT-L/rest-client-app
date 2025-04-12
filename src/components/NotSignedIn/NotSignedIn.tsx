import styles from './NotSignedIn.module.scss';
import React from 'react';

export const NotSignedIn: React.FC = () => {
  return (
    <div className={styles.notSignedIn}>
      <p>You are not signed in</p>
      <p>Please do it and come back</p>
    </div>
  );
};
