'use strict';
let language = /^zh/i.test(navigator.language) ? 'zh' : 'en';
try { language = localStorage.getItem('roleleaf-language') || language; } catch {}
if (!['en', 'zh'].includes(language)) language = 'en';
const release = window.ROLELEAF_RELEASE;
if (release.url) {
  document.querySelector('#android-qr img').src = 'android-qr.svg';
  document.querySelector('#android-qr').hidden = false;
}
function render() {
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.title = language === 'zh' ? 'RoleLeaf — 下载体验版' : 'RoleLeaf — Try the demo';
  for (const item of document.querySelectorAll('[data-en]')) item.innerHTML = item.dataset[language];
  document.querySelector('#language').textContent = language === 'en' ? '中文' : 'English';
  document.querySelector('#language').setAttribute('aria-label', language === 'en' ? '切换为中文' : 'Switch to English');
  for (const artifact of release.artifacts) {
    const button = document.querySelector('#' + artifact.platform + '-download');
    button.href = 'files/' + encodeURIComponent(artifact.filename);
    button.download = artifact.filename;
    document.querySelector('#' + artifact.platform + '-info').textContent = `${artifact.minimum} · ${artifact.version} · ${(artifact.bytes / 1024 / 1024).toFixed(1)} MB`;
  }
  document.querySelector('#release-info').textContent = `Demo ${release.version} · ${release.date}`;
}
document.querySelector('#language').addEventListener('click', () => {
  language = language === 'en' ? 'zh' : 'en';
  try { localStorage.setItem('roleleaf-language', language); } catch {}
  render();
});
document.querySelector('#copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('chrome://extensions');
    document.querySelector('#copy').textContent = language === 'en' ? 'Copied' : '已复制';
    document.querySelector('#announcement').textContent = language === 'en' ? 'Address copied.' : '地址已复制。';
  } catch {
    const range = document.createRange(); range.selectNodeContents(document.querySelector('.copy-row code'));
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    document.querySelector('#announcement').textContent = language === 'en' ? 'Select and copy the highlighted address.' : '请复制已选中的地址。';
  }
});
for (const artifact of release.artifacts) {
  const name = document.createElement('div'); name.textContent = artifact.filename;
  const hash = document.createElement('code'); hash.textContent = artifact.sha256;
  document.querySelector('#hashes').append(name, hash);
}
render();
