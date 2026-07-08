import { useEffect, useState } from 'react';
import { fetchLatestRelease, type ReleaseInfo } from '../lib/release';

export function useLatestRelease() {
  const [release, setRelease] = useState<ReleaseInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const info = await fetchLatestRelease();
      if (cancelled) return;
      setRelease(info);
      setError(info.fallback);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { release, loading, error };
}
