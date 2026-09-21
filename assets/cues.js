/* Progressive enhancement: the site remains usable with JavaScript disabled. */
(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const search = document.querySelector('#article-search');
  if (search) {
    const entries = [...document.querySelectorAll('#article-list .entry')];
    const animations = new Map();
    const stopFades = () => {
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
    reducedMotion.addEventListener('change', stopFades);
    search.addEventListener('input', () => {
      stopFades();
      const query = search.value.trim().toLowerCase();
      let count = 0;
      entries.forEach(entry => {
        entry.hidden = !entry.textContent.toLowerCase().includes(query);
        if (entry.hidden) return;
        count++;
        if (!reducedMotion.matches && entry.animate) {
          animations.set(entry, entry.animate(
            [{ opacity: 0.55 }, { opacity: 1 }],
            { duration: 150, easing: 'ease-out' }
          ));
        }
      });
      document.querySelector('#search-count').textContent = `${count} of ${entries.length} essays`;
      document.querySelector('#no-results').hidden = count !== 0;
    });
  }

  const svgNS = 'http://www.w3.org/2000/svg';
  const node = (tag, attrs) => {
    const element = document.createElementNS(svgNS, tag);
    Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  };

  document.querySelectorAll('.brand .brand-dot').forEach(dot => {
    if (dot.querySelector('svg')) return;
    dot.setAttribute('aria-hidden', 'true');
    const svg = node('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' });
    svg.append(node('path', {
      d: 'M12 12L4 5M12 12L21 7M12 12L18 21M4 5L21 7',
      fill: 'none', stroke: 'currentColor', 'stroke-width': '1.2', class: 'cue-links'
    }));
    const satellites = node('g', { fill: 'currentColor', class: 'cue-nodes' });
    [[4, 5], [21, 7], [18, 21]].forEach(([cx, cy]) => {
      satellites.append(node('circle', { cx, cy, r: '2' }));
    });
    svg.append(satellites, node('circle', {
      cx: '12', cy: '12', r: '4', fill: 'currentColor', class: 'cue-center'
    }));
    dot.replaceChildren(svg);
  });

  const article = document.querySelector('main.article');
  if (!article) return;

  const actions = document.createElement('div');
  actions.className = 'article-actions';
  const copy = document.createElement('button');
  copy.type = 'button';
  copy.className = 'copy-link';
  copy.textContent = 'Copy link';
  const status = document.createElement('span');
  status.className = 'copy-status';
  status.setAttribute('role', 'status');
  const manualLink = document.createElement('input');
  manualLink.type = 'text';
  manualLink.readOnly = true;
  manualLink.hidden = true;
  manualLink.setAttribute('aria-label', 'Article link to copy');
  actions.append(copy, status, manualLink);
  const byline = document.querySelector('.article-byline');
  if (byline) byline.after(actions);
  else article.prepend(actions);

  let resetCopy;
  copy.addEventListener('click', async () => {
    clearTimeout(resetCopy);
    // Copy the page being read, including its section link, but not tracking queries.
    const url = new URL(window.location.href);
    url.search = '';
    manualLink.value = url.href;
    copy.disabled = true;
    status.textContent = '';
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url.href);
        copied = true;
      }
    } catch { /* Offer the selectable link below if clipboard access is denied. */ }
    if (!copied) {
      // Also supports phone previews served over local HTTP without Clipboard API.
      manualLink.hidden = false;
      manualLink.focus();
      manualLink.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
    }
    copy.disabled = false;
    if (copied) {
      manualLink.hidden = true;
      copy.focus({ preventScroll: true });
      copy.textContent = 'Copied ✓';
      copy.dataset.copied = 'true';
      status.textContent = 'Link copied.';
      resetCopy = window.setTimeout(() => {
        copy.textContent = 'Copy link';
        delete copy.dataset.copied;
        status.textContent = '';
      }, 2000);
    } else {
      copy.textContent = 'Copy link';
      delete copy.dataset.copied;
      status.textContent = 'Select and copy the link below.';
    }
  });

  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);

  let frame = 0;
  const update = () => {
    frame = 0;
    const bounds = article.getBoundingClientRect();
    // Start when the article reaches the viewport top; finish at its bottom.
    const distance = Math.max(1, bounds.height - window.innerHeight);
    const fraction = Math.max(0, Math.min(1, -bounds.top / distance));
    progress.style.width = `${(fraction * 100).toFixed(3)}%`;
  };
  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  window.addEventListener('load', schedule, { once: true });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    observer.observe(article);
    observer.observe(document.body);
  }
  schedule();
})();
