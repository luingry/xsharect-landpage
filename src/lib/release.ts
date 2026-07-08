const GITHUB_API =
  'https://api.github.com/repos/luingry/xsharect/releases/latest';
const RELEASES_PAGE =
  'https://github.com/luingry/xsharect/releases/latest';

export type ReleaseInfo = {
  version: string;
  downloadUrl: string;
  releaseNotes: string;
  fallback: boolean;
};

function pickApkAsset(assets: Array<{ name: string; browser_download_url: string }>) {
  const named = assets.find((a) => a.name.endsWith('.apk'));
  return named?.browser_download_url ?? null;
}

export async function fetchLatestRelease(): Promise<ReleaseInfo> {
  try {
    const res = await fetch(GITHUB_API, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const tag = String(data.tag_name ?? '').replace(/^v/i, '');
    const assets = Array.isArray(data.assets) ? data.assets : [];
    const downloadUrl = pickApkAsset(assets);
    if (!downloadUrl) throw new Error('No APK asset');
    return {
      version: tag,
      downloadUrl,
      releaseNotes: String(data.body ?? '').trim(),
      fallback: false,
    };
  } catch {
    return {
      version: '',
      downloadUrl: RELEASES_PAGE,
      releaseNotes: '',
      fallback: true,
    };
  }
}

export { RELEASES_PAGE };
