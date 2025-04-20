'use client';

import { useState, JSX } from 'react';
import { RestClientState } from '@/models/rest-client';
import { useVariables } from '@/components/Variables/useVariables';
import { generateCode } from '@/utils/codeGenerator';
import styles from './CodeGenerator.module.scss';
import { useTranslations } from 'next-intl';

interface CodeGeneratorProps {
  state: RestClientState;
}

const LANGUAGES = [
  { name: 'curl', label: 'cURL' },
  { name: 'javascript', label: 'JavaScript (Fetch)' },
  { name: 'xhr', label: 'JavaScript (XHR)' },
  { name: 'nodejs', label: 'Node.js' },
  { name: 'python', label: 'Python' },
  { name: 'java', label: 'Java' },
  { name: 'csharp', label: 'C#' },
  { name: 'go', label: 'Go' },
];

export default function CodeGenerator({
  state,
}: CodeGeneratorProps): JSX.Element {
  const [selectedLanguage, setSelectedLanguage] = useState('curl');
  const [variables] = useVariables();
  const t = useTranslations('CodeGenerator');

  const getGeneratedCode = (): string => {
    return generateCode(state, variables, selectedLanguage);
  };

  return (
    <div className={styles.componentContainer}>
      <div className={styles.header}>
        <h3>{t('title')}</h3>
        <select
          value={selectedLanguage}
          onChange={e => setSelectedLanguage(e.target.value)}
          className={styles.select}
        >
          {LANGUAGES.map(({ name, label }) => (
            <option key={name} value={name}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <pre className={styles.code}>{getGeneratedCode()}</pre>
    </div>
  );
}
