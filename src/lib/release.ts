import seedLatest from '../../public/apk/latest.json';

const LATEST_JSON_URL = `${import.meta.env.BASE_URL}apk/latest.json`;

export type ReleaseInfo = {
  version: string;
  downloadUrl: string;
  releaseNotes: string;
  fallback: boolean;
};

type LatestJson = {
  version_name?: string;
  apk_download_url?: string;
  release_notes?: string;
};

function fromLatestJson(data: LatestJson, fallback: boolean): ReleaseInfo {
  const version = String(data.version_name ?? '').trim();
  const downloadUrl = String(data.apk_download_url ?? '').trim();
  if (!version || !downloadUrl) throw new Error('Invalid latest.json');
  return {
    version,
    downloadUrl,
    releaseNotes: String(data.release_notes ?? '').trim(),
    fallback,
  };
}

export async function fetchLatestRelease(): Promise<ReleaseInfo> {
  try {
    const res = await fetch(LATEST_JSON_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return fromLatestJson((await res.json()) as LatestJson, false);
  } catch {
    try {
      return fromLatestJson(seedLatest as LatestJson, true);
    } catch {
      return {
        version: '',
        downloadUrl: LATEST_JSON_URL,
        releaseNotes: '',
        fallback: true,
      };
    }
  }
}
