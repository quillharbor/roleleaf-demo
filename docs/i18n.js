(function (root) {
  'use strict';

  const languages = Object.freeze({ en: 'English', ar: 'العربية', ja: '日本語', ko: '한국어', 'zh-Hant': '繁體中文' });
  const storageKey = 'roleleaf-language';
  const catalogs = Object.create(null);

  function normalize(value) {
    return Object.hasOwn(languages, value) ? value : 'en';
  }

  function readLanguage() {
    try { return normalize(root.localStorage.getItem(storageKey)); } catch { return 'en'; }
  }

  let language = readLanguage();

  function register(rows) {
    for (const [source, ar, ja, ko, traditional] of rows) {
      catalogs[source] = { ar, ja, ko, 'zh-Hant': traditional };
    }
  }

  function t(source, values = {}) {
    const template = catalogs[source]?.[language] ?? source;
    return template.replace(/\{(\w+)\}/g, (token, name) => {
      if (!Object.hasOwn(values, name)) return token;
      const value = values[name];
      return typeof value === 'number' ? new Intl.NumberFormat(language).format(value) : String(value);
    });
  }

  function render() {
    const doc = root.document;
    doc.documentElement.lang = language;
    doc.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    for (const node of doc.querySelectorAll('[data-i18n]')) node.textContent = t(node.dataset.i18n);
    for (const attribute of ['aria-label', 'placeholder', 'alt', 'content']) {
      for (const node of doc.querySelectorAll(`[data-i18n-${attribute}]`)) {
        node.setAttribute(attribute, t(node.getAttribute(`data-i18n-${attribute}`)));
      }
    }
  }

  function select(value) {
    language = normalize(value);
  }

  function bindLanguageMenu(menu, onChange = render) {
    for (const [code, name] of Object.entries(languages)) {
      const option = root.document.createElement('option');
      option.value = code;
      option.lang = code;
      option.dir = code === 'ar' ? 'rtl' : 'ltr';
      option.textContent = name;
      menu.append(option);
    }
    menu.value = language;
    menu.addEventListener('change', () => {
      select(menu.value);
      try { root.localStorage.setItem(storageKey, language); } catch {}
      onChange(language);
    });
  }

  root.RoleLeafI18n = { languages, normalize, register, t, render, select, bindLanguageMenu, get language() { return language; } };
})(globalThis);
