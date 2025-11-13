const YEAR_TARGETS = document.querySelectorAll('#year');
const nav = document.querySelector('.site-nav');
const toggle = document.querySelector('.menu-toggle');
const storageKey = 'cde-nav-collapsed';

const applyYear = () => {
  YEAR_TARGETS.forEach((node) => {
    node.textContent = new Date().getFullYear().toString();
  });
};

const supportsStorage = (() => {
  try {
    const key = '__cde-test__';
    localStorage.setItem(key, key);
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn('localStorage unavailable, state persistence disabled.', error);
    return false;
  }
})();

const getInitialCollapseState = () => {
  if (supportsStorage) {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) {
      return stored === 'true';
    }
  }
  return window.matchMedia('(max-width: 767px)').matches;
};

let isCollapsed = nav ? getInitialCollapseState() : false;

const updateNavUI = () => {
  if (!nav || !toggle) return;
  nav.dataset.collapsed = String(isCollapsed);
  toggle.setAttribute('aria-expanded', String(!isCollapsed));
  toggle.setAttribute(
    'aria-label',
    isCollapsed ? 'Open primary navigation' : 'Close primary navigation'
  );
  toggle.textContent = isCollapsed ? 'Menu' : 'Close';
};

const handleToggleClick = () => {
  isCollapsed = !isCollapsed;
  if (supportsStorage) {
    localStorage.setItem(storageKey, String(isCollapsed));
  }
  updateNavUI();
};

const initNavToggle = () => {
  if (!toggle || !nav) return;
  updateNavUI();
  toggle.addEventListener('click', handleToggleClick);

  const mq = window.matchMedia('(min-width: 768px)');
  const syncForDesktop = (event) => {
    if (event.matches) {
      nav.dataset.collapsed = 'false';
      toggle.setAttribute('aria-expanded', 'true');
    } else {
      updateNavUI();
    }
  };

  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', syncForDesktop);
  } else if (typeof mq.addListener === 'function') {
    mq.addListener(syncForDesktop);
  }
};

const init = () => {
  applyYear();
  initNavToggle();
};

init();
