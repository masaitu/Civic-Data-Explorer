import { cleanInput, hasMinLength, isValidEmail } from './modules/sanitize.js';

const showMessage = (form, message, type = 'success') => {
  const target = form.querySelector('[data-form-feedback]');
  if (!target) return;
  target.textContent = message;
  target.hidden = false;
  target.className = `form-feedback ${type}`;
};

const clearMessages = (form) => {
  const target = form.querySelector('[data-form-feedback]');
  if (target) {
    target.hidden = true;
    target.textContent = '';
    target.className = 'form-feedback';
  }
};

const validateForm = (form) => {
  const name = cleanInput(form.name.value);
  const email = cleanInput(form.email.value);
  const need = cleanInput(form['dataset-need'].value, { max: 500 });
  const errors = [];

  if (!hasMinLength(name, 2)) errors.push('Name must have at least 2 characters.');
  if (!isValidEmail(email)) errors.push('Please enter a valid email address.');
  if (!hasMinLength(need, 5)) errors.push('Please describe your dataset need.');

  form.name.value = name;
  form.email.value = email;
  form['dataset-need'].value = need;

  return { valid: errors.length === 0, errors };
};

export const mountFormView = (root = document) => {
  const form = root.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearMessages(form);
    const result = validateForm(form);
    if (!result.valid) {
      showMessage(form, result.errors.join(' '), 'error');
      return;
    }
    showMessage(form, 'Thanks! Your feedback has been saved locally.', 'success');
    try {
      localStorage.setItem(
        'cde-feedback-draft',
        JSON.stringify({
          name: form.name.value,
          email: form.email.value,
          need: form['dataset-need'].value,
          followup: form.followup.value,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (error) {
      // best-effort persistence
    }
    form.reset();
  });
};
