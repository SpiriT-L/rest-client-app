'use client';
import { useState } from 'react';
import styles from './HeadersEditor.module.scss';
import { Header } from '@/models/rest-client';
import { useTranslations } from 'next-intl';

interface HeadersEditorProps {
  headers: Header[];
  onChange: (headers: Header[]) => void;
}

export default function HeadersEditor({
  headers,
  onChange,
}: HeadersEditorProps) {
  const t = useTranslations('HeadersEditor');
  const [newHeader, setNewHeader] = useState<Header>({ key: '', value: '' });

  const handleAddHeader = () => {
    if (newHeader.key && newHeader.value) {
      onChange([...headers, newHeader]);
      setNewHeader({ key: '', value: '' });
    }
  };

  const handleRemoveHeader = (index: number) => {
    onChange(headers.filter((_, i) => i !== index));
  };

  const handleUpdateHeader = (
    index: number,
    field: keyof Header,
    value: string
  ) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index] = { ...updatedHeaders[index], [field]: value };
    onChange(updatedHeaders);
  };

  return (
    <div className={styles.componentContainer}>
      <div className={styles.headersList}>
        {headers.map((header, index) => (
          <div key={index} className={styles.headerRow}>
            <input
              type="text"
              value={header.key}
              onChange={e => handleUpdateHeader(index, 'key', e.target.value)}
              placeholder={t('header_name')}
              className={styles.input}
            />
            <input
              type="text"
              value={header.value}
              onChange={e => handleUpdateHeader(index, 'value', e.target.value)}
              placeholder={t('header_value')}
              className={styles.input}
            />
            <button
              onClick={() => handleRemoveHeader(index)}
              className={styles.removeButton}
            >
              {t('remove_header')}
            </button>
          </div>
        ))}
      </div>

      <div className={styles.newHeader}>
        <input
          type="text"
          value={newHeader.key}
          onChange={e => setNewHeader({ ...newHeader, key: e.target.value })}
          placeholder={t('new_header_key')}
          className={styles.input}
        />
        <input
          type="text"
          value={newHeader.value}
          onChange={e => setNewHeader({ ...newHeader, value: e.target.value })}
          placeholder={t('new_header_value')}
          className={styles.input}
        />
        <button onClick={handleAddHeader} className={styles.addButton}>
          {t('add_header')}
        </button>
      </div>
    </div>
  );
}
