import { JSX } from 'react';
import styles from './page.module.scss';

export default function Home(): JSX.Element {
  return (
    <>
      <main>
        <div className={styles.container}>
          <h1>Home page</h1>
        </div>
      </main>
    </>
  );
}
