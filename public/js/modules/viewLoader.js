export const fetchFragment = async (path) => {
  const response = await fetch(path, { headers: { Accept: 'text/html' } });
  if (!response.ok) {
    const error = new Error(`Failed to fetch ${path} (${response.status})`);
    error.status = response.status;
    throw error;
  }
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const main = doc.querySelector('main');
  const aside = doc.querySelector('aside');
  return { main, aside };
};

export const replaceContent = ({ mainTarget, asideTarget, fragment }) => {
  if (mainTarget && fragment.main) {
    mainTarget.innerHTML = fragment.main.innerHTML;
    mainTarget.setAttribute('tabindex', '-1');
  }
  if (asideTarget && fragment.aside) {
    asideTarget.innerHTML = fragment.aside.innerHTML;
  }
};
