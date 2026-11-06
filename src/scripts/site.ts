import './easter-egg';
import { duration } from '../data/experience';

type Theme = 'light' | 'dark';

function currentTheme(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === 'light' || chosen === 'dark') return chosen;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function initThemeToggle(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!button) return;

  const sync = () => button.setAttribute('aria-pressed', String(currentTheme() === 'dark'));
  sync();

  button.addEventListener('click', () => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    window.__theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Storage unavailable: the choice still holds for this session.
    }
    sync();
  });
}

function initReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>('.reveal');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  targets.forEach((el) => observer.observe(el));
}

/** On the home page, mark the nav link of the section being read. */
function initSectionHighlight(): void {
  const links = new Map<string, HTMLAnchorElement>();
  document.querySelectorAll<HTMLAnchorElement>('nav a[data-section]').forEach((link) => {
    const section = link.dataset.section;
    if (section && document.getElementById(section)) links.set(section, link);
  });
  // The projects link is a real page elsewhere; only treat it as a section when home has one.
  if (links.size < 2 || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((link) => link.removeAttribute('aria-current'));
        // The hero has no nav link, so reaching it just clears the highlight.
        links.get(entry.target.id)?.setAttribute('aria-current', 'true');
      }
    },
    { rootMargin: '-35% 0px -60% 0px' },
  );
  links.forEach((_, id) => observer.observe(document.getElementById(id)!));
  const hero = document.querySelector('.hero');
  if (hero) observer.observe(hero);
}

function initTagFilter(): void {
  const filter = document.querySelector<HTMLElement>('[data-tag-filter]');
  const list = document.querySelector<HTMLElement>('[data-project-list]');
  if (!filter || !list) return;

  const buttons = [...filter.querySelectorAll<HTMLButtonElement>('button[data-tag]')];
  const items = [...list.querySelectorAll<HTMLElement>('li[data-tags]')];
  const status = document.querySelector<HTMLElement>('[data-filter-status]');
  filter.hidden = false;

  filter.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-tag]');
    if (!button) return;
    const tag = button.dataset.tag ?? '';

    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    let shown = 0;
    for (const item of items) {
      const tags: string[] = JSON.parse(item.dataset.tags ?? '[]');
      const match = tag === '' || tags.includes(tag);
      item.hidden = !match;
      if (match) shown++;
    }
    if (status) status.textContent = `${shown} ${shown === 1 ? 'project' : 'projects'} shown`;
  });
}

const motionOK = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => window.matchMedia('(pointer: fine)').matches;
const STAR = 'M12 0C12.6 6.5 17.5 11.4 24 12 17.5 12.6 12.6 17.5 12 24 11.4 17.5 6.5 12.6 0 12 6.5 11.4 11.4 6.5 12 0Z';

/** Work history: skill highlighter, Quick look mode, ruler jumps, live duration of the current role. */
function initTimeline(): void {
  const root = document.querySelector<HTMLElement>('[data-timeline]');
  if (!root) return;

  root.querySelectorAll<HTMLElement>('.dur[data-end=""]').forEach((badge) => {
    badge.textContent = duration(badge.dataset.start ?? '', null);
  });

  const chips = [...root.querySelectorAll<HTMLButtonElement>('.chip')];
  const status = root.querySelector<HTMLElement>('[data-hl-status]')!;
  const jobs = [...root.querySelectorAll<HTMLElement>('[data-job]')];
  const segs = [...root.querySelectorAll<HTMLButtonElement>('.seg')];
  const modeButtons = [...root.querySelectorAll<HTMLButtonElement>('[data-mode]')];
  const picked = new Set<string>();
  const opened = new Set<HTMLElement>();
  let skim = false;
  try {
    skim = localStorage.getItem('resume-skim') === '1';
  } catch {
    // Storage unavailable: start in full detail.
  }

  const render = () => {
    const on = picked.size > 0;
    root.classList.toggle('filtering', on);
    let hits = 0;
    let places = 0;
    jobs.forEach((job, i) => {
      const lis = [...job.querySelectorAll<HTMLElement>('li[data-tags]')];
      let jobHits = 0;
      let hidden = 0;
      lis.forEach((li, k) => {
        const hit = on && (li.dataset.tags ?? '').split('|').some((t) => picked.has(t));
        li.classList.toggle('hit', hit);
        if (hit) jobHits++;
        const hide = skim && !opened.has(job) && k >= 2 && !hit;
        li.classList.toggle('hide', hide);
        if (hide) hidden++;
      });
      hits += jobHits;
      if (jobHits) places++;
      segs[i]?.classList.toggle('lit', jobHits > 0);
      const more = job.querySelector<HTMLButtonElement>('[data-more]');
      if (more) {
        more.hidden = hidden === 0;
        more.textContent = `Show ${hidden} more`;
      }
    });
    status.textContent = '';
    if (on) {
      status.append(`${hits} line${hits === 1 ? '' : 's'} across ${places} role${places === 1 ? '' : 's'}`);
      const clear = document.createElement('button');
      clear.type = 'button';
      clear.textContent = 'Clear';
      clear.addEventListener('click', () => {
        picked.clear();
        chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
        render();
      });
      status.append(clear);
    }
    modeButtons.forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.mode === 'skim') === skim)));
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const tag = chip.dataset.tag ?? '';
      if (picked.has(tag)) picked.delete(tag);
      else picked.add(tag);
      chip.setAttribute('aria-pressed', String(picked.has(tag)));
      render();
    });
  });
  modeButtons.forEach((b) => {
    b.addEventListener('click', () => {
      skim = b.dataset.mode === 'skim';
      opened.clear();
      try {
        localStorage.setItem('resume-skim', skim ? '1' : '0');
      } catch {
        // Storage unavailable: the choice holds for this visit.
      }
      render();
    });
  });
  jobs.forEach((job) => {
    job.querySelector('[data-more]')?.addEventListener('click', () => {
      opened.add(job);
      render();
    });
  });

  const read = root.querySelector<HTMLElement>('[data-ruler-read]')!;
  const idle = read.textContent ?? '';
  segs.forEach((seg) => {
    const show = () => {
      const [title, ...rest] = (seg.dataset.label ?? '').split(' · ');
      read.textContent = '';
      const b = document.createElement('b');
      b.textContent = title;
      read.append(b, ` · ${rest.join(' · ')}`);
    };
    seg.addEventListener('mouseenter', show);
    seg.addEventListener('focus', show);
    seg.addEventListener('mouseleave', () => (read.textContent = idle));
    seg.addEventListener('click', () => {
      show();
      const job = document.getElementById(seg.dataset.target ?? '');
      if (!job) return;
      job.scrollIntoView({ behavior: motionOK() ? 'smooth' : 'auto', block: 'start' });
      job.classList.remove('flash');
      void job.offsetWidth; // restart the flash
      job.classList.add('flash');
    });
  });

  render();
}

/** Copy icon beside the email. */
function initCopy(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    const note = button.parentElement?.querySelector<HTMLElement>('[data-copied]');
    let timer = 0;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy ?? '');
        button.classList.add('done');
        if (note) note.textContent = 'Copied!';
      } catch {
        if (note) note.textContent = 'Press ⌘C to copy';
        const email = button.parentElement?.querySelector('.email');
        if (email) window.getSelection()?.selectAllChildren(email);
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        button.classList.remove('done');
        if (note) note.textContent = '';
      }, 1600);
    });
  });
}

/** Project cards tilt toward the pointer, with a shine that follows it. */
function initTilt(): void {
  if (!motionOK() || !finePointer()) return;
  document.querySelectorAll<HTMLElement>('.project-grid .card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const r = card.getBoundingClientRect();
      const x = (event.clientX - r.left) / r.width;
      const y = (event.clientY - r.top) / r.height;
      card.classList.add('tilting');
      card.style.transform = `perspective(700px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 10}deg) translateY(-3px)`;
      card.style.setProperty('--mx', `${x * 100}%`);
      card.style.setProperty('--my', `${y * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('tilting');
      card.style.transform = '';
    });
  });
}

/** Tiny gold, blue and pink stars trail the pointer across the hero. */
function initSparkleTrail(): void {
  const hero = document.querySelector<HTMLElement>('[data-sparkle-trail]');
  if (!hero || !motionOK() || !finePointer()) return;
  const colors = ['var(--gold)', 'var(--accent)', 'var(--pink)'];
  let last = 0;
  let live = 0;
  hero.addEventListener('pointermove', (event) => {
    const now = performance.now();
    if (now - last < 45 || live > 18) return;
    last = now;
    const star = document.createElement('span');
    const size = 8 + Math.random() * 8;
    star.className = 'trail-star';
    star.style.cssText = `left:${event.clientX + (Math.random() - 0.5) * 14}px;top:${event.clientY + (Math.random() - 0.5) * 14}px;width:${size}px;height:${size}px;color:${colors[Math.floor(Math.random() * colors.length)]}`;
    star.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${STAR}"/></svg>`;
    document.body.append(star);
    live++;
    window.setTimeout(() => {
      star.remove();
      live--;
    }, 950);
  });
}

/** Reading progress bar. Registered once; finds the bar again after each page swap. */
function updateProgress(): void {
  const bar = document.querySelector<HTMLElement>('[data-progress]');
  if (!bar) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);

// Fires on first load and after every view transition.
document.addEventListener('astro:page-load', () => {
  initThemeToggle();
  initReveal();
  initSectionHighlight();
  initTagFilter();
  initTimeline();
  initCopy();
  initTilt();
  initSparkleTrail();
  updateProgress();
});
