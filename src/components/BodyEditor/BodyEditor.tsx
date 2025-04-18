'use client';

import { useState, useEffect, JSX } from 'react';
import styles from './BodyEditor.module.scss';
import { useTranslations } from 'next-intl';

interface BodyEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  title?: string;
}

export default function BodyEditor({
  value,
  onChange,
  readOnly = false,
  title = 'Request Body',
}: BodyEditorProps): JSX.Element {
  const [localValue, setLocalValue] = useState(value);
  const [formatError, setFormatError] = useState<string | null>(null);
  const [isJson, setIsJson] = useState(false);
  const t = useTranslations('BodyEditor');

  useEffect(() => {
    try {
      const parsed = JSON.parse(value);
      setIsJson(true);
      if (readOnly) {
        setLocalValue(JSON.stringify(parsed, null, 2));
      } else {
        setLocalValue(value);
      }
    } catch {
      setIsJson(false);
      setLocalValue(value);
    }
  }, [value, readOnly]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    if (readOnly) return;
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange?.(newValue);

    try {
      JSON.parse(newValue);
      setIsJson(true);
      setFormatError(null);
    } catch {
      setIsJson(false);
      setFormatError(null);
    }
  };

  const handleFormat = (): void => {
    if (!isJson) return;

    try {
      const parsed = JSON.parse(localValue);
      const formatted = JSON.stringify(parsed, null, 2);
      setLocalValue(formatted);
      onChange?.(formatted);
      setFormatError(null);
    } catch (error) {
      console.error(error);
      setFormatError(t('format_error'));
    }
  };

  return (
    <div className={styles.componentContainer}>
      <div className={styles.componentHeader}>
        <h3>{title}</h3>
        {!readOnly && isJson && (
          <button onClick={handleFormat} className={styles.formatButton}>
            {t('format_json')}
          </button>
        )}
      </div>
      <textarea
        className={styles.textarea}
        value={localValue}
        onChange={handleChange}
        readOnly={readOnly}
        placeholder={
          readOnly ? t('format_placeholder_view') : t('format_placeholder_edit')
        }
      />
      {formatError && <div className={styles.error}>{formatError}</div>}
    </div>
  );
}
