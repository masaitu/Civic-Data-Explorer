export const escapeHtml = (value = '') =>
  value
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const cleanInput = (value = '', { max = 120 } = {}) => {
  const trimmed = value.toString().trim().slice(0, max);
  return trimmed.replace(/[<>]/g, '');
};

export const isValidEmail = (value = '') => /\S+@\S+\.\S+/.test(value.trim());

export const hasMinLength = (value = '', min = 2) => value.trim().length >= min;
