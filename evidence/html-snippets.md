# HTML evidence snippets

## Landmark template (all pages)
```html
<body>
  <a class="skip-link" href="#main">Skip to main content</a>
  <header role="banner">…</header>
  <nav aria-label="Primary">…</nav>
  <main id="main" tabindex="-1">…</main>
  <aside aria-label="Helpful links">…</aside>
  <footer>…</footer>
</body>
```

## Skip link target
```html
<a class="skip-link" href="#main">Skip to main content</a>
<main id="main" tabindex="-1">…</main>
```

## Form group with helper text
```html
<div class="form-group">
  <label for="name">Full name *</label>
  <input id="name" name="name" type="text" required autocomplete="name" />
  <p class="helper-text">Enter at least two characters.</p>
</div>
```

## ARIA example
```html
<li><a aria-current="page" href="views/data.html">Datasets</a></li>
```

## Keyboard-operable disclosure
```html
<button
  class="menu-toggle"
  type="button"
  aria-expanded="false"
  aria-controls="primary-navigation"
>
  Menu
</button>
```
