export class AppStore {
  constructor(initialState = {}) {
    this.state = { route: '#/home', notice: '', ...initialState };
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  setRoute(route) {
    this.state = { ...this.state, route };
    this.emit();
  }

  setNotice(notice) {
    this.state = { ...this.state, notice };
    this.emit();
  }

  emit() {
    this.listeners.forEach((listener) => listener(this.state));
  }
}
