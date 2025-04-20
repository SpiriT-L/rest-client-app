'use client';

import { useState, useEffect, useCallback, useRef, JSX } from 'react';
import { RestClientState, HttpMethod, Header } from '@/models/rest-client';
import { useVariables } from '@/components/Variables/useVariables';
import { useHistory } from '@/components/History/useHistory';
import { substituteVariables } from '@/utils/variableSubstitution';
import MethodSelector from '../MethodSelector/MethodSelector';
import UrlInput from '../UrlInput/UrlInput';
import HeadersEditor from '../HeadersEditor/HeadersEditor';
import BodyEditor from '../BodyEditor/BodyEditor';
import CodeGenerator from '../CodeGenerator/CodeGenerator';
import styles from './RestClient.module.scss';
import { useLocale, useTranslations } from 'next-intl';

const DEFAULT_STATE: RestClientState = {
  method: 'GET',
  url: '',
  headers: [],
  body: '',
  response: {
    status: null,
    body: '',
    ok: '',
  },
};

const safeBtoa = (str: string): string => {
  if (typeof window === 'undefined') return '';
  try {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      })
    )
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (e) {
    console.error('Error encoding string:', e);
    return '';
  }
};

const safeAtob = (str: string): string => {
  if (typeof window === 'undefined') return '';
  try {
    const padded = str + '='.repeat((4 - (str.length % 4)) % 4);
    return decodeURIComponent(
      atob(padded.replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  } catch (e) {
    console.error('Error decoding string:', e);
    return '';
  }
};

export interface RestClientProps {
  initialMethod?: string;
  initialUrl?: string;
  initialBody?: string;
  initialHeaders?: Header[];
}

export default function RestClient({
  initialMethod,
  initialUrl,
  initialBody,
}: RestClientProps): JSX.Element | null {
  const [state, setState] = useState<RestClientState>(DEFAULT_STATE);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pendingUrlUpdate = useRef<RestClientState | null>(null);
  const [variables] = useVariables();
  const { addRequestToHistory } = useHistory();
  const t = useTranslations('RestClient');
  const locale = useLocale();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (pendingUrlUpdate.current && isClient) {
      const newState = pendingUrlUpdate.current;

      const substitutedUrl = substituteVariables(newState.url, variables);
      const substitutedBody = substituteVariables(newState.body, variables);
      const substitutedHeaders = newState.headers.map(header => ({
        key: substituteVariables(header.key, variables),
        value: substituteVariables(header.value, variables),
      }));

      const encodedUrl = safeBtoa(substitutedUrl);

      const headerParams = substitutedHeaders.reduce((params, header) => {
        if (header.key && header.value) {
          params.append(header.key, header.value);
        }
        return params;
      }, new URLSearchParams());

      const queryString = headerParams.toString();
      const encodedBody = substitutedBody
        ? `/${safeBtoa(substitutedBody)}`
        : '';
      const newPath = `/${locale}/rest-client/${newState.method}/${encodedUrl}${encodedBody}${queryString ? `?${queryString}` : ''}`;

      window.history.pushState({}, '', newPath);
      pendingUrlUpdate.current = null;
    }
  }, [state, isClient, variables, locale]);

  useEffect(() => {
    if (!isInitialized && isClient) {
      const method = (initialMethod as HttpMethod) || 'GET';
      const url = initialUrl ? safeAtob(initialUrl) : '';
      const body = initialBody ? safeAtob(initialBody) : '';

      const searchParams = new URLSearchParams(window.location.search);
      const headers: Header[] = [];
      searchParams.forEach((value, key) => {
        if (key !== 'body') {
          headers.push({ key, value });
        }
      });

      setState(prev => ({
        ...prev,
        method,
        url,
        body,
        headers,
      }));
      setIsInitialized(true);
    }
  }, [initialMethod, initialUrl, initialBody, isInitialized, isClient]);

  const handleMethodChange = useCallback((method: HttpMethod) => {
    setState(prev => {
      const newState = { ...prev, method };
      pendingUrlUpdate.current = newState;
      return newState;
    });
  }, []);

  const handleUrlChange = useCallback((url: string) => {
    setState(prev => {
      const newState = { ...prev, url };
      pendingUrlUpdate.current = newState;
      return newState;
    });
  }, []);

  const handleHeadersChange = useCallback((headers: Header[]) => {
    setState(prev => {
      const newState = { ...prev, headers };
      pendingUrlUpdate.current = newState;
      return newState;
    });
  }, []);

  const handleBodyChange = useCallback((body: string) => {
    setState(prev => {
      const newState = { ...prev, body };
      pendingUrlUpdate.current = newState;
      return newState;
    });
  }, []);

  const handleSubmit = async (): Promise<void> => {
    try {
      const substitutedUrl = substituteVariables(state.url, variables);
      const substitutedHeaders = state.headers.map(header => ({
        key: substituteVariables(header.key, variables),
        value: substituteVariables(header.value, variables),
      }));
      const substitutedBody = substituteVariables(state.body, variables);

      const response = await fetch('/api/rest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: substitutedUrl,
          method: state.method,
          headers: substitutedHeaders.reduce(
            (acc, { key, value }) => {
              acc[key] = value;
              return acc;
            },
            {} as Record<string, string>
          ),
          body: substitutedBody || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to make request');
      }

      const {
        status,
        body: responseBody,
        ok: responseOk,
      } = await response.json();
      addRequestToHistory({
        url: substitutedUrl,
        method: state.method,
        headers: substitutedHeaders.reduce(
          (acc, { key, value }) => {
            acc[key] = value;
            return acc;
          },
          {} as Record<string, string>
        ),
        body: substitutedBody || undefined,
        executionTime: Date.now(),
      });

      setState(prev => ({
        ...prev,
        response: {
          status,
          body: responseBody,
          ok: responseOk === true ? 'OK' : '❌',
        },
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        response: {
          status: null,
          ok: '',
          body: `${t('response_error_message')}: ${error}`,
        },
      }));
    }
  };

  if (!isClient || !isInitialized) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.clientSection}>
        <div className={styles.requestControls}>
          <MethodSelector value={state.method} onChange={handleMethodChange} />
          <UrlInput value={state.url} onChange={handleUrlChange} />
        </div>

        <HeadersEditor headers={state.headers} onChange={handleHeadersChange} />

        <CodeGenerator state={state} />

        <BodyEditor
          value={state.body}
          onChange={handleBodyChange}
          title={t('request_body')}
        />

        <button
          onClick={handleSubmit}
          className={styles.submitButton}
          disabled={!state.url.trim()}
        >
          {t('send_request')}
        </button>
      </div>

      <div className={styles.responseSection}>
        {state.response.status !== null && (
          <div className={styles.status}>
            {t('response_status')}:{' '}
            <span className={styles.statusCode}>
              {state.response.status} {state.response.ok}
            </span>
          </div>
        )}
        <BodyEditor
          value={state.response.body}
          readOnly={true}
          title={t('response_body')}
        />
      </div>
    </div>
  );
}
