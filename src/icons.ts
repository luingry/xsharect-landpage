// Phosphor (regular) icons, inlined at build time. Markup uses <i class="ph ph-NAME">.
import androidLogo from "@phosphor-icons/core/assets/regular/android-logo.svg?raw";
import arrowsClockwise from "@phosphor-icons/core/assets/regular/arrows-clockwise.svg?raw";
import broadcast from "@phosphor-icons/core/assets/regular/broadcast.svg?raw";
import browser from "@phosphor-icons/core/assets/regular/browser.svg?raw";
import clipboardText from "@phosphor-icons/core/assets/regular/clipboard-text.svg?raw";
import cornersOut from "@phosphor-icons/core/assets/regular/corners-out.svg?raw";
import downloadSimple from "@phosphor-icons/core/assets/regular/download-simple.svg?raw";
import folderOpen from "@phosphor-icons/core/assets/regular/folder-open.svg?raw";
import handPointing from "@phosphor-icons/core/assets/regular/hand-pointing.svg?raw";
import handTap from "@phosphor-icons/core/assets/regular/hand-tap.svg?raw";
import lockKey from "@phosphor-icons/core/assets/regular/lock-key.svg?raw";
import password from "@phosphor-icons/core/assets/regular/password.svg?raw";
import play from "@phosphor-icons/core/assets/regular/play.svg?raw";
import shieldCheck from "@phosphor-icons/core/assets/regular/shield-check.svg?raw";
import squaresFour from "@phosphor-icons/core/assets/regular/squares-four.svg?raw";
import uploadSimple from "@phosphor-icons/core/assets/regular/upload-simple.svg?raw";
import wifiHigh from "@phosphor-icons/core/assets/regular/wifi-high.svg?raw";

const ICONS: Record<string, string> = {
  "android-logo": androidLogo,
  "arrows-clockwise": arrowsClockwise,
  "broadcast": broadcast,
  "browser": browser,
  "clipboard-text": clipboardText,
  "corners-out": cornersOut,
  "download-simple": downloadSimple,
  "folder-open": folderOpen,
  "hand-pointing": handPointing,
  "hand-tap": handTap,
  "lock-key": lockKey,
  "password": password,
  "play": play,
  "shield-check": shieldCheck,
  "squares-four": squaresFour,
  "upload-simple": uploadSimple,
  "wifi-high": wifiHigh,
};

// Large background marks: Phosphor Bold (thick stroke only), one per section they sit in.
import broadcastBold from "@phosphor-icons/core/assets/bold/broadcast-bold.svg?raw";
import clipboardTextBold from "@phosphor-icons/core/assets/bold/clipboard-text-bold.svg?raw";
import shieldCheckBold from "@phosphor-icons/core/assets/bold/shield-check-bold.svg?raw";

const BG_ICONS: Record<string, string> = {
  "broadcast": broadcastBold,
  "clipboard-text": clipboardTextBold,
  "shield-check": shieldCheckBold,
};

export function mountBgIcons(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>("[data-bgicon]").forEach((el) => {
    const svg = BG_ICONS[el.dataset.bgicon!];
    if (svg) el.innerHTML = svg.replace("<svg", '<svg aria-hidden="true" focusable="false"');
  });
}

export function mountIcons(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>("i.ph").forEach((el) => {
    const name = [...el.classList].find((c) => c.startsWith("ph-"))?.slice(3);
    const svg = name && ICONS[name];
    if (!svg) return;
    el.innerHTML = svg.replace("<svg", '<svg aria-hidden="true" focusable="false"');
    el.setAttribute("aria-hidden", "true");
  });
}
