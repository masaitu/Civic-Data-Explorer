import { HashRouter } from './modules/router.js';
import { fetchFragment, replaceContent } from './modules/viewLoader.js';
import { mountDataView } from './data-page.js';
import { AppStore } from './modules/appStore.js';

const mainTarget = document.querySelector('#app-main');
const asideTarget = document.querySelector('#app-aside');
const navLinks = document.querySelectorAll('[data-route-link]');
const store = new AppStore();

const routes = {
  '#/home': { path: 'fragments/home.html', title: 'Home' },
  '#/datasets': { path: 'fragments/data.html', title: 'Datasets', onMount: mountDataView },
  '#/feedback': { path: 'fragments/form.html', title: 'Feedback' },
};

const setActiveNav = (hash) => {
  navLinks.forEach((link) => {
    const target = link.getAttribute('href');
    const isActive = target === hash;
    link.setAttribute('aria-current', isActive ? 'page' : 'false');
  });
};

const router = new HashRouter({
  routes,
  onNavigate: async ({ hash, route }) => {
    try {
      const fragment = await fetchFragment(route.path);
      replaceContent({ mainTarget, asideTarget, fragment });
      document.title = `Civic Data Explorer | ${route.title}`;
      setActiveNav(hash);
      store.setRoute(hash);
      if (route.onMount) {
        route.onMount(mainTarget);
      }
      mainTarget?.focus();
    } catch (error) {
      console.error('Unable to load route fragment', error);
      store.setNotice('Unable to load content. Please try again or use full page links.');
    }
  },
});

store.subscribe((state) => {
  const notice = document.querySelector('[data-app-notice]');
  if (notice) {
    notice.textContent = state.notice;
    notice.hidden = !state.notice;
  }
});

if (mainTarget && asideTarget) {
  router.start();
}
