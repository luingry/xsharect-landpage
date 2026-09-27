import "./styles.css";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LiquidShader } from "./shader";
import { mountBgIcons, mountIcons } from "./icons";
import { DOWNLOAD_PAGE_URL, fetchLatestRelease, notesToHtml } from "./release";

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s)!;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
const EASE = "expo.out";

document.documentElement.classList.add("js");
mountIcons();
mountBgIcons();
$("[data-year]").textContent = String(new Date().getFullYear());

/* ---------------- Smooth scroll ---------------- */
const lenis = reduce ? null : new Lenis({ lerp: 0.13, wheelMultiplier: 1 });
if (lenis) {
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const scrollTo = (target: number | HTMLElement, immediate = false) => {
  if (lenis) lenis.scrollTo(target, { immediate, duration: 1.4, easing: (x) => 1 - Math.pow(1 - x, 4) });
  else window.scrollTo({ top: typeof target === "number" ? target : target.offsetTop, behavior: immediate ? "auto" : "smooth" });
};
$$<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href")!;
    const el = id === "#top" ? document.body : document.querySelector<HTMLElement>(id);
    if (!el) return;
    e.preventDefault();
    scrollTo(id === "#top" ? 0 : el);
    history.replaceState(null, "", id);
  }),
);

/* ---------------- Shaders ---------------- */
const heroShader = LiquidShader.create($<HTMLCanvasElement>(".hero__shader"), { scale: 0.4, still: reduce, interactive: finePointer });
LiquidShader.create($<HTMLCanvasElement>(".download__shader"), { scale: 0.3, still: reduce });

/* ---------------- Hero ---------------- */
const heroStage = $(".hero__stage");
if (!reduce) {
  const tl = gsap.timeline({ defaults: { ease: EASE }, delay: 0.15 });
  tl.from("[data-hero-line]", { yPercent: 115, rotate: 3, duration: 1.5, stagger: 0.12 })
    .fromTo("[data-hero-in]", { opacity: 0, y: 24, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.1 }, 0.35)
    .from(heroStage, { y: 70, duration: 1.8 }, 0.2)
    .fromTo(".browser", { opacity: 0, clipPath: "inset(0% 0% 0% 100% round 16px)" }, { opacity: 1, clipPath: "inset(0% 0% 0% 0% round 16px)", duration: 1.6 }, 0.35)
    // filter is handed back to CSS afterwards: the front/back swap drives brightness through it
    .fromTo(".phone", { opacity: 0, filter: "blur(14px)" }, { opacity: 1, filter: "blur(0px)", duration: 1.4, onComplete: () => gsap.set(".phone", { clearProps: "filter" }) }, 0.6)
    .fromTo(".beam", { opacity: 0 }, { opacity: 1, duration: 1 }, 1.2);

  // phone and desktop previews trade places: each holds the front for a few seconds
  const phone = $(".phone"), browser = $(".browser");
  const HOLD = 4.5;
  const k = innerWidth < 720 ? 0.35 : 1; // narrow screens: keep the moves inside the 16px gutter
  const px = (v: number) => `${Math.round(v * k)}px`;
  const BACK = { "--s": 0.9, "--b": 0.5, "--tx": px(-20), "--ty": px(90) }; // peeks out below the (now larger) desktop
  const FRONT_PHONE = { "--s": 1, "--b": 1, "--tx": "0px", "--ty": "0px" };
  const FRONT_DESK = { "--s": innerWidth < 720 ? 1.02 : 1.04, "--b": 1, "--tx": "0px", "--ty": px(20) }; // no leftward move: the title column is right there
  const REST_DESK = { "--s": 1, "--b": 0.62, "--tx": "0px", "--ty": "0px" };
  const swap = (toDesk: boolean) => {
    const rising = toDesk ? browser : phone, sinking = toDesk ? phone : browser;
    return gsap.timeline()
      .to(sinking, { ...(toDesk ? BACK : REST_DESK), duration: 1, ease: "power3.inOut" }, 0)
      .to(rising, { "--s": 0.97, "--tx": px(toDesk ? 40 : -40), duration: 0.45, ease: "power2.in" }, 0)
      .set(rising, { zIndex: 3 }, 0.44)
      .set(sinking, { zIndex: 1 }, 0.44)
      .to(rising, { ...(toDesk ? FRONT_DESK : FRONT_PHONE), duration: 0.9, ease: EASE }, 0.45);
  };
  const shuffle = gsap.timeline({ repeat: -1, delay: 1.6 + HOLD })
    .add(swap(true))
    .add(swap(false), `+=${HOLD}`)
    .to({}, { duration: HOLD });
  ScrollTrigger.create({ trigger: ".hero", start: "top bottom", end: "bottom top", onToggle: ({ isActive }) => (isActive ? shuffle.resume() : shuffle.pause()) });

  // leaving the hero: copy lifts and fades, devices drift, shader dims
  gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.5 } })
    .to("[data-hero-copy]", { yPercent: -18, opacity: 0, ease: "none" }, 0)
    .to(heroStage, { y: -120, opacity: 0.2, ease: "none" }, 0)
    .to({ v: 1 }, { v: 0.35, ease: "none", onUpdate() { if (heroShader) heroShader.dim = this.targets()[0].v; } }, 0);

  // pointer parallax on the device stack (independent `translate` so it never fights transforms)
  if (finePointer) {
    const layers = $$("[data-depth]", heroStage).map((el) => ({ el, d: parseFloat(el.dataset.depth!) }));
    const p = { x: 0, y: 0, tx: 0, ty: 0 };
    $(".hero").addEventListener("pointermove", (e) => {
      p.tx = e.clientX / innerWidth - 0.5;
      p.ty = e.clientY / innerHeight - 0.5;
    });
    gsap.ticker.add(() => {
      p.x += (p.tx - p.x) * 0.06;
      p.y += (p.ty - p.y) * 0.06;
      for (const { el, d } of layers)
        el.style.translate = `calc(${(-p.x * 36 * d).toFixed(2)}px + var(--tx, 0px)) calc(${(-p.y * 26 * d).toFixed(2)}px + var(--ty, 0px))`;
    });
  }
}

// both hero loops share one 9 s timeline; keep the desktop mirror on the phone's clock
{
  const pv = $<HTMLVideoElement>(".phone__screen"), dv = $<HTMLVideoElement>(".browser__screen");
  pv.addEventListener("timeupdate", () => {
    const d = Math.abs(dv.currentTime - pv.currentTime);
    if (!dv.paused && dv.readyState > 2 && d > 0.25 && d < (dv.duration || 9) - 0.25) dv.currentTime = pv.currentTime;
  });
}

/* ---------------- Background marks: one at a time, drifting slower than the page ---------------- */
$$("[data-bgicon]").forEach((el) => {
  if (reduce) return;
  gsap.timeline({ scrollTrigger: { trigger: el.parentElement!, start: "top bottom", end: "bottom top", scrub: 0.8 } })
    .fromTo(el, { y: () => -innerHeight * 0.28, rotate: el.classList.contains("bgicon--left") ? -8 : 8 },
      { y: () => innerHeight * 0.28, rotate: 0, ease: "none", duration: 1 }, 0)
    // visible only while its section holds the middle of the viewport, so marks never overlap
    .fromTo(el, { opacity: 0 }, { opacity: 1, ease: "power1.out", duration: 0.2 }, 0.18)
    .to(el, { opacity: 0, ease: "power1.in", duration: 0.2 }, 0.62);
});

/* ---------------- Overview portal ---------------- */
if (!reduce) {
  gsap.timeline({ scrollTrigger: { trigger: ".portal", start: "top bottom", end: "bottom bottom", scrub: 0.7 } })
    .fromTo("[data-portal]", { scale: 0.42, y: "12vh", borderRadius: 40, rotateX: 18, transformPerspective: 1400 },
      { scale: 1, y: 0, borderRadius: 26, rotateX: 0, ease: "power2.out", duration: 0.55 })
    .fromTo("[data-portal-word]", { opacity: 1, scale: 0.9, filter: "blur(0px)" }, { opacity: 0, scale: 1.18, filter: "blur(10px)", ease: "none", duration: 0.45 }, 0.1)
    .fromTo("[data-portal-cap]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.15 }, 0.5)
    .to("[data-portal]", { scale: 0.94, opacity: 0.6, duration: 0.3, ease: "power1.in" }, 0.85)
    .to("[data-portal-cap]", { opacity: 0, duration: 0.15 }, 0.9);
}

/* ---------------- Manifesto: words light up with scroll ---------------- */
{
  const el = $("[data-words]");
  const words = el.textContent!.trim().split(/\s+/);
  el.innerHTML = words.map((w) => `<span class="w${/servidor|nuvem/i.test(w) ? " is-accent" : ""}">${w}</span>`).join(" ");
  if (!reduce)
    gsap.to($$(".w", el), { opacity: 1, stagger: 0.12, ease: "none", scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 42%", scrub: 0.4 } });
}

/* ---------------- How it works: sticky visual follows the active step ---------------- */
{
  const visual = $("[data-how-visual]");
  const steps = $$("[data-step-trigger]");
  steps.forEach((step) =>
    ScrollTrigger.create({
      trigger: step,
      start: "top 58%",
      end: "bottom 42%",
      onToggle: ({ isActive }) => {
        if (!isActive) return;
        steps.forEach((s) => s.classList.toggle("is-active", s === step));
        visual.dataset.step = step.dataset.stepTrigger!;
      },
    }),
  );
  steps[0].classList.add("is-active");
}

/* ---------------- Generic reveals (reverse when scrolling back up) ---------------- */
const HEADINGS = ".h2, .download__title";
/** Wrap every word (inside <em> too) in a clipping mask so it can rise into place. */
const splitWords = (root: Element) => {
  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType !== Node.TEXT_NODE) { walk(child); continue; }
      const frag = document.createDocumentFragment();
      for (const part of child.textContent!.split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) { frag.append(" "); continue; }
        const mask = document.createElement("span");
        mask.className = "wm";
        mask.innerHTML = `<span class="wi"></span>`;
        mask.firstElementChild!.textContent = part;
        frag.append(mask);
      }
      child.replaceWith(frag);
    }
  };
  walk(root);
  return $$(".wi", root);
};

if (!reduce) {
  const reveal = (el: Element) =>
    gsap.fromTo(el, { opacity: 0, y: 24 }, {
      opacity: 1, y: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" },
    });
  const revealHeading = (h: HTMLElement) => {
    gsap.set(h, { opacity: 1 });
    gsap.fromTo(splitWords(h), { yPercent: 105 }, {
      yPercent: 0, duration: 1.15, ease: EASE, stagger: 0.045,
      scrollTrigger: { trigger: h, start: "top 90%", toggleActions: "play none none reverse" },
    });
  };
  $$("[data-reveal]").forEach((el) => {
    if (el.matches(HEADINGS)) return revealHeading(el);
    const inner = $$(HEADINGS, el);
    if (!inner.length) return reveal(el);
    // container (section header): heading gets the word mask, the rest fades up
    gsap.set(el, { opacity: 1 });
    inner.forEach(revealHeading);
    Array.from(el.children).filter((c) => !inner.includes(c as HTMLElement)).forEach(reveal);
  });
  $$("[data-stagger]").forEach((list) =>
    gsap.fromTo(list.children, { opacity: 0, y: 26 }, {
      opacity: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.08,
      scrollTrigger: { trigger: list, start: "top 86%", toggleActions: "play none none reverse" },
    }),
  );

  // films settle into place as they arrive
  $$("[data-vframe]").forEach((el) =>
    gsap.fromTo(el, { "--sr": "16deg", "--sc": 0.9 }, {
      "--sr": "0deg", "--sc": 1, ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "center 55%", scrub: 0.6 },
    }),
  );
  gsap.fromTo("[data-clip]", { clipPath: "inset(10% 14% 10% 14% round 40px)" }, {
    clipPath: "inset(0% 0% 0% 0% round 22px)", ease: "none",
    scrollTrigger: { trigger: "[data-clip]", start: "top 95%", end: "center 60%", scrub: 0.6 },
  });
  gsap.fromTo("[data-clip] video", { scale: 1.18 }, {
    scale: 1, ease: "none",
    scrollTrigger: { trigger: "[data-clip]", start: "top bottom", end: "bottom top", scrub: true },
  });
}

/* ---------------- Marquee: constant speed, right-to-left, independent of scroll ---------------- */
{
  const row = $("[data-marquee]");
  const set = row.firstElementChild as HTMLElement;
  row.append(set.cloneNode(true), set.cloneNode(true));
  let x = 0;
  if (!reduce)
    gsap.ticker.add((_, dt) => {
      const w = set.offsetWidth;
      x -= 0.045 * dt;
      if (x <= -w) x += w;
      row.style.transform = `translate3d(${x}px,0,0)`;
    });
}

/* ---------------- Hover physics ---------------- */
if (finePointer && !reduce) {
  $$("[data-magnetic]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      el.style.setProperty("--mx", `${dx * 0.22}px`);
      el.style.setProperty("--my", `${dy * 0.3}px`);
      el.style.setProperty("--hx", `${e.clientX - r.left}px`);
      el.style.setProperty("--hy", `${e.clientY - r.top}px`);
    });
    el.addEventListener("pointerleave", () => { el.style.setProperty("--mx", "0px"); el.style.setProperty("--my", "0px"); });
  });
  $$("[data-tilt]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--ry", `${(px - 0.5) * 7}deg`);
      el.style.setProperty("--rx", `${(0.5 - py) * 6}deg`);
      el.style.setProperty("--hx", `${px * 100}%`);
      el.style.setProperty("--hy", `${py * 100}%`);
    });
    el.addEventListener("pointerleave", () => { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); });
  });
  $$("[data-spot]").forEach((el) =>
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--sx", `${e.clientX - r.left}px`);
      el.style.setProperty("--sy", `${e.clientY - r.top}px`);
    }),
  );
}

/* ---------------- Animated disclosure (FAQ items, release notes) ---------------- */
// `is-open` drives the icon so it turns at click time; `open` is only dropped after the collapse ends.
// `body` must be a padding-free clipping wrapper so its height can reach 0.
const disclosure = (d: HTMLDetailsElement, body: HTMLElement) => {
  const text = body.firstElementChild!;
  d.classList.toggle("is-open", d.open);
  $("summary", d).addEventListener("click", (e) => {
    if (reduce) { d.classList.toggle("is-open", !d.open); return; }
    e.preventDefault();
    gsap.killTweensOf([body, text]);
    const closing = d.classList.contains("is-open");
    d.classList.toggle("is-open", !closing);
    if (closing) {
      gsap.to(text, { y: -6, opacity: 0, duration: 0.3, ease: "power2.in" });
      gsap.to(body, {
        height: 0, duration: 0.5, ease: "power3.inOut",
        onComplete: () => { d.open = false; gsap.set([body, text], { clearProps: "all" }); ScrollTrigger.refresh(); },
      });
    } else {
      const from = d.open ? body.offsetHeight : 0;
      d.open = true;
      gsap.fromTo(body, { height: from }, { height: "auto", duration: 0.6, ease: "power3.inOut", onComplete: () => { ScrollTrigger.refresh(); } });
      gsap.fromTo(text, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, delay: 0.12, ease: "power2.out" });
    }
  });
};
$$<HTMLDetailsElement>(".qa").forEach((d) => disclosure(d, $(".qa__a", d)));
{
  const notes = $<HTMLDetailsElement>("[data-notes]");
  disclosure(notes, $(".notes__a", notes));
}

/* ---------------- Videos: lazy source, play only while visible ---------------- */
{
  const io = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      const v = target as HTMLVideoElement;
      if (isIntersecting) {
        if (!v.src && v.dataset.src) { v.src = v.dataset.src; v.load(); }
        if (!reduce) v.play().catch(() => {});
      } else v.pause();
    }
  }, { threshold: 0.2 });
  $$<HTMLVideoElement>("video").forEach((v) => {
    v.muted = true;
    io.observe(v);
  });
}

/* ---------------- Nav: hide on the way down, return on the way up ---------------- */
{
  const nav = $("[data-nav]");
  const links = $$<HTMLAnchorElement>(".nav__links a");
  const onScroll = (y: number, dir: number) => {
    nav.classList.toggle("is-solid", y > 40);
    nav.classList.toggle("is-hidden", dir === 1 && y > 320);
  };
  if (lenis) lenis.on("scroll", (l: Lenis) => onScroll(l.scroll, l.direction));
  else ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => onScroll(s.scroll(), s.direction) });
  links.forEach((a) => {
    const sec = document.querySelector(a.getAttribute("href")!);
    if (sec)
      ScrollTrigger.create({
        trigger: sec, start: "top 50%", end: "bottom 50%",
        onToggle: ({ isActive }) => a.classList.toggle("is-active", isActive),
      });
  });
}

/* ---------------- Custom scrollbar ---------------- */
{
  const rail = $(".rail"), thumb = $(".rail__thumb"), pct = $(".rail__pct"), marksEl = $(".rail__marks");
  const sections = $$("[data-section]");
  let max = 1, trackH = 1, thumbH = 40, marks: { el: HTMLElement; at: number }[] = [];
  let idle = 0;

  const measure = () => {
    const doc = document.documentElement;
    max = Math.max(1, doc.scrollHeight - innerHeight);
    trackH = innerHeight - 28;
    thumbH = Math.max(40, trackH * (innerHeight / doc.scrollHeight));
    thumb.style.height = `${thumbH}px`;
    marksEl.innerHTML = "";
    marks = sections.map((s) => {
      const at = Math.min(1, (s.getBoundingClientRect().top + scrollY) / max);
      const m = document.createElement("span");
      m.className = "rail__mark";
      m.style.top = `${at * 100}%`;
      const label = document.createElement("span");
      label.textContent = s.dataset.section!;
      m.append(label);
      m.addEventListener("pointerdown", (e) => e.stopPropagation());
      m.addEventListener("click", () => scrollTo(s === sections[0] ? 0 : s));
      marksEl.append(m);
      return { el: m, at };
    });
    paint(scrollY);
  };
  const paint = (y: number) => {
    const p = Math.min(1, Math.max(0, y / max));
    thumb.style.transform = `translate3d(0,${p * (trackH - thumbH)}px,0)`;
    pct.textContent = `${Math.round(p * 100)}%`;
    let current = -1;
    marks.forEach((m, i) => {
      const past = p + 0.001 >= m.at;
      m.el.classList.toggle("is-past", past);
      if (past) current = i;
    });
    marks.forEach((m, i) => m.el.classList.toggle("is-current", i === current));
    rail.classList.add("is-moving");
    clearTimeout(idle);
    idle = window.setTimeout(() => rail.classList.remove("is-moving"), 900);
  };
  const yFromPointer = (clientY: number, grabOffset: number) =>
    ((clientY - 14 - grabOffset) / (trackH - thumbH)) * max;

  let grab = -1;
  thumb.addEventListener("pointerdown", (e) => {
    grab = e.clientY - thumb.getBoundingClientRect().top;
    thumb.setPointerCapture(e.pointerId);
    rail.classList.add("is-drag");
    e.preventDefault();
  });
  thumb.addEventListener("pointermove", (e) => {
    if (grab < 0) return;
    scrollTo(Math.min(max, Math.max(0, yFromPointer(e.clientY, grab))), true);
  });
  const release = () => { grab = -1; rail.classList.remove("is-drag"); };
  thumb.addEventListener("pointerup", release);
  thumb.addEventListener("pointercancel", release);
  rail.addEventListener("pointerdown", (e) => {
    if (e.target === thumb || thumb.contains(e.target as Node)) return;
    scrollTo(Math.min(max, Math.max(0, yFromPointer(e.clientY, thumbH / 2))));
  });

  if (lenis) lenis.on("scroll", (l: Lenis) => paint(l.scroll));
  else ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => paint(s.scroll()) });
  ScrollTrigger.addEventListener("refresh", measure);
  addEventListener("load", () => ScrollTrigger.refresh());
  measure();
  requestAnimationFrame(() => rail.classList.add("is-ready"));
}

/* ---------------- Download ---------------- */
(async () => {
  const btn = $<HTMLAnchorElement>("[data-download]");
  const meta = $("[data-version]");
  const err = $("[data-release-error]");
  const info = await fetchLatestRelease();
  if (!info) {
    btn.href = DOWNLOAD_PAGE_URL;
    meta.textContent = "Android 10+";
    err.textContent = "Não foi possível confirmar a versão mais recente agora. O botão leva à página oficial de download.";
    err.hidden = false;
    return;
  }
  btn.href = info.downloadUrl;
  btn.setAttribute("download", "");
  btn.setAttribute("aria-label", `Baixar APK do xSharect versão ${info.version}`);
  meta.textContent = `v${info.version}`;
  if (info.fallback) {
    err.textContent = "Não foi possível confirmar a versão mais recente agora. O link aponta para a última versão conhecida.";
    err.hidden = false;
  }
  if (info.releaseNotes) {
    $("[data-notes-body]").innerHTML = notesToHtml(info.releaseNotes);
    $("[data-notes]").hidden = false;
    ScrollTrigger.refresh();
  }
})();
