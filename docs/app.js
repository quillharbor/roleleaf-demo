/* global RoleLeafI18n */
'use strict';

const { t, bindLanguageMenu } = RoleLeafI18n;
const release = window.ROLELEAF_RELEASE;

if (release.url) {
  document.querySelector('#android-qr img').src = 'android-qr.svg';
  document.querySelector('#android-qr').hidden = false;
}
for (const artifact of release.artifacts) {
  const button = document.querySelector('#' + artifact.platform + '-download');
  button.href = 'files/' + encodeURIComponent(artifact.filename);
  button.download = artifact.filename;
  const name = document.createElement('div');
  name.textContent = artifact.filename;
  const hash = document.createElement('code');
  hash.textContent = artifact.sha256;
  document.querySelector('#hashes').append(name, hash);
}

function render() {
  RoleLeafI18n.render();
  const formatter = new Intl.NumberFormat(RoleLeafI18n.language, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  for (const artifact of release.artifacts) {
    const size = formatter.format(artifact.bytes / 1024 / 1024);
    document.querySelector('#' + artifact.platform + '-info').textContent = `${t(artifact.minimum)} · ${artifact.version} · ${size} MB`;
  }
  document.querySelector('#release-info').textContent = t('Demo {version} · {date}', release);
  document.querySelector('#announcement').textContent = '';
}

const requestedLanguage = new URL(location.href).searchParams.get('lang');
if (requestedLanguage) RoleLeafI18n.select(requestedLanguage);
bindLanguageMenu(document.querySelector('#language'), language => {
  const url = new URL(location.href);
  url.searchParams.set('lang', language);
  history.replaceState(history.state, '', url);
  render();
});
document.querySelector('#copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('chrome://extensions');
    document.querySelector('#copy').textContent = t('Copied');
    document.querySelector('#announcement').textContent = t('Address copied.');
  } catch {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('.copy-row code'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.querySelector('#announcement').textContent = t('Select and copy the highlighted address.');
  }
});
render();
