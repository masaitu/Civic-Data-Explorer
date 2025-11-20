export class HashRouter {
  constructor({ routes = {}, onNavigate } = {}) {
    this.routes = routes;
    this.onNavigate = onNavigate;
    this.current = null;
    this.handleChange = this.handleChange.bind(this);
  }

  start() {
    window.addEventListener('hashchange', this.handleChange);
    this.handleChange();
  }

  stop() {
    window.removeEventListener('hashchange', this.handleChange);
  }

  normalize(hash) {
    if (!hash || hash === '#') return '#/home';
    return hash;
  }

  async handleChange() {
    const hash = this.normalize(window.location.hash);
    const route = this.routes[hash];
    this.current = hash;

    if (!route) {
      window.location.hash = '#/home';
      return;
    }

    if (typeof this.onNavigate === 'function') {
      await this.onNavigate({ hash, route });
    }
  }
}
