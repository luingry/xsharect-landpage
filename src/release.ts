// Download contract: the app's release pipeline commits public/apk/latest.json (+ the APK)
// to this repo, so every deploy of the site (Vercel at the root, GitHub Pages under
// /xsharect-landpage/) ships its own copy. Read it same-origin first (relative, works under
// any base), then the canonical GitHub Pages copy (CORS *), then the bundled seed.
import seed from "./latest.seed.json";

const LATEST_JSON_URLS = ["apk/latest.json", "https://luingry.github.io/xsharect-landpage/apk/latest.json"];
export const DOWNLOAD_PAGE_URL = "https://luingry.github.io/xsharect-landpage/#download";

export type ReleaseInfo = { version: string; downloadUrl: string; releaseNotes: string; fallback: boolean };
type LatestJson = { version_name?: string; apk_download_url?: string; release_notes?: string };

function parse(data: LatestJson, fallback: boolean): ReleaseInfo {
  const version = String(data.version_name ?? "").trim();
  const downloadUrl = String(data.apk_download_url ?? "").trim();
  if (!version || !/^https:\/\//.test(downloadUrl)) throw new Error("Invalid latest.json");
  return { version, downloadUrl, releaseNotes: String(data.release_notes ?? "").trim(), fallback };
}

export async function fetchLatestRelease(): Promise<ReleaseInfo | null> {
  for (const url of LATEST_JSON_URLS) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 6000);
      const res = await fetch(url, { cache: "no-store", signal: ctrl.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return parse((await res.json()) as LatestJson, false);
    } catch {
      // try the next source
    }
  }
  try {
    return parse(seed as LatestJson, true);
  } catch {
    return null;
  }
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Tiny renderer for the release-notes subset the pipeline emits (### headings, - bullets). */
export function notesToHtml(md: string): string {
  const out: string[] = [];
  let inList = false;
  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("### ")) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<h4>${esc(line.slice(4))}</h4>`);
    } else if (line.startsWith("- ")) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${esc(line.slice(2))}`);
    } else if (inList) {
      out.push(` ${esc(line)}`);
    } else {
      out.push(`<p>${esc(line)}</p>`);
    }
  }
  if (inList) out.push("</ul>");
  return out.join("");
}
