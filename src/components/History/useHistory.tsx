import { useEffect, useState } from 'react';
import { RequestModel } from '@/models/request.model';

export const useHistory = (): {
  history: RequestModel[] | null;
  addRequestToHistory: (request: RequestModel) => void;
} => {
  const [history, setHistory] = useState<RequestModel[] | null>(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem('rss-history');
    if (storedHistory) {
      try {
        const sortedHistory = JSON.parse(storedHistory).sort(
          (a: RequestModel, b: RequestModel) => {
            return (b.executionTime || 0) - (a.executionTime || 0);
          }
        );
        setHistory(sortedHistory);
      } catch {
        setHistory(null);
      }
    }
  }, []);
  const addRequestToHistory = (request: RequestModel): void => {
    localStorage.setItem(
      'rss-history',
      JSON.stringify([request, ...(history || [])])
    );
  };

  return { history, addRequestToHistory };
};
