'use client';

type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS';
import styles from './MethodSelector.module.scss';

interface MethodSelectorProps {
  value: HttpMethod;
  onChange: (method: HttpMethod) => void;
}

const METHODS: HttpMethod[] = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'HEAD',
  'OPTIONS',
];

export default function MethodSelector({
  value,
  onChange,
}: MethodSelectorProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as HttpMethod)}
      className={styles.select}
    >
      {METHODS.map(method => (
        <option key={method} value={method}>
          {method}
        </option>
      ))}
    </select>
  );
}
