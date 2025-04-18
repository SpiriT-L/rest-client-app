'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RestClientState, HttpMethod, Header } from '@/models/rest-client';
import { useVariables } from '@/components/Variables/useVariables';
import { substituteVariables } from '@/utils/variableSubstitution';
import MethodSelector from '../MethodSelector/MethodSelector';
import UrlInput from '../UrlInput/UrlInput';
import HeadersEditor from '../HeadersEditor/HeadersEditor';
import BodyEditor from '../BodyEditor/BodyEditor';
import CodeGenerator from '../CodeGenerator/CodeGenerator';
import styles from './RestClient.module.scss';
import { useTranslations } from 'next-intl';
const DEFAULT_STATE: RestClientState = {
  method: 'GET',
  url: '',
  headers: [],
  body: '',
  response: {
    status: null,
    body: '',
  },
};

const safeBtoa = (str: string) => {
  if (typeof window === 'undefined') return '';
  return btoa(str);
};

const safeAtob = (str: string) => {
  if (typeof window === 'undefined') return '';
  return atob(str);
};

export default function RestClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<RestClientState>(DEFAULT_STATE);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pendingUrlUpdate = useRef<RestClientState | null>(null);
  const [variables] = useVariables();
  const t = useTranslations('RestClient');
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isInitialized && isClient) {
      const method = (searchParams.get('method') as HttpMethod) || 'GET';
      const url = searchParams.get('url')
        ? safeAtob(searchParams.get('url')!)
        : '';
      const body = searchParams.get('body')
        ? safeAtob(searchParams.get('body')!)
        : '';

      const headers: Header[] = [];
      searchParams.forEach((value, key) => {
        if (key !== 'method' && key !== 'url' && key !== 'body') {
          headers.push({ key, value: decodeURIComponent(value) });
        }
      });

      setState({
        method,
        url,
        body,
        headers,
        response: {
          status: null,
          body: '',
        },
      });
      setIsInitialized(true);
    }
  }, [searchParams, isInitialized, isClient]);

  useEffect(() => {
    if (pendingUrlUpdate.current && isClient) {
      const newState = pendingUrlUpdate.current;
      const params = new URLSearchParams();
      params.set('method', newState.method);
      params.set('url', safeBtoa(newState.url));

      if (newState.body) {
        params.set('body', safeBtoa(newState.body));
      }

      newState.headers.forEach(header => {
        params.set(header.key, encodeURIComponent(header.value));
      });

      const newUrl = `/rest-client?${params.toString()}`;
      router.push(newUrl, { scroll: false });
      pendingUrlUpdate.current = null;
    }
  }, [state, isClient, router]);

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

  const handleSubmit = async () => {
    try {
      const substitutedUrl = substituteVariables(state.url, variables);
      const substitutedHeaders = state.headers.map(header => ({
        ...header,
        value: substituteVariables(header.value, variables),
      }));
      const substitutedBody = substituteVariables(state.body, variables);

      const response = await fetch(substitutedUrl, {
        method: state.method,
        headers: substitutedHeaders.reduce(
          (acc, { key, value }) => {
            acc[key] = value;
            return acc;
          },
          {} as Record<string, string>
        ),
        body: substitutedBody ? substitutedBody : undefined,
      });

      const responseBody = await response.text();

      setState(prev => ({
        ...prev,
        response: {
          status: response.status,
          body: responseBody,
        },
      }));
    } catch (error) {
      console.error('Error making request:', error);
      setState(prev => ({
        ...prev,
        response: {
          status: null,
          body: JSON.stringify({ error: t('response_error_message') }),
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

        <button onClick={handleSubmit} className={styles.submitButton}>
          {t('send_request')}
        </button>
      </div>

      <div className={styles.responseSection}>
        {state.response.status !== null && (
          <div className={styles.status}>
            {t('response_status')}:{' '}
            <span className={styles.statusCode}>{state.response.status}</span>
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
