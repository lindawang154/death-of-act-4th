'use strict';
const state = { catalog: null, profile: null, progress: { locations: [], evidence: [], inspected: [], notes: {}, report: null }, evidence: [], archiveFilter: 'all', search: '', renderVersion: 0 };
const main = document.getElementById('main');
const dialog = document.getElementById('detail-dialog');
const dialogContent = document.getElementById('dialog-content');
const locationById = id => state.catalog?.locations.find(item => item.id === id);
const identityById = id => state.catalog?.identities?.[id];
const hasEvidence = id => state.progress.evidence.includes(id);
const mainEvidenceCount = () => state.progress.evidence.filter(id => id !== 'debate-draft').length;
const currentView = () => (location.hash.slice(1) || 'home').split('/');

function applySession(data) {
  if (data.token) setToken(data.token);
  if (data.profile) state.profile = data.profile;
  if (data.progress) state.progress = data.progress;
  updateChrome();
}
function updateChrome() {
  const storageStatus = document.getElementById('storage-status');
  if (storageStatus) storageStatus.textContent = window.ARG_STATIC_STORAGE_WARNING || '进度保存在当前浏览器 · 虚构案件';
  if (!state.profile) return;
  document.getElementById('profile-name').textContent = state.profile.nickname;
  document.getElementById('profile-avatar').textContent = state.profile.nickname.slice(0, 1) || '调';
  document.getElementById('archive-count').textContent = state.progress.evidence.length;
  const view = currentView()[0];
  document.querySelectorAll('[data-nav]').forEach(item => item.classList.toggle('active', item.dataset.nav === (view === 'scene' ? 'locations' : view === 'report' || view === 'solution' ? 'archive' : view)));
}
async function refreshSession() { applySession(await api('/api/me')); }
async function loadEvidence() { state.evidence = (await api('/api/evidence')).evidence; return state.evidence; }
function go(hash) { if (location.hash === '#' + hash) renderCurrent(); else location.hash = hash; }
function emptyState(title, text, action = '') { return `<div class="empty-state"><div class="empty-symbol" aria-hidden="true">⌕</div><h2>${esc(title)}</h2><p>${esc(text)}</p>${action}</div>`; }
function loading() { main.innerHTML = '<div class="loading-state"><span class="loader"></span><p>正在调取材料…</p></div>'; }
function dialogShell(title, eyebrow, body) {
  dialogContent.innerHTML = `<div class="dialog-header"><div><div class="eyebrow">${esc(eyebrow)}</div><h2 id="dialog-title">${esc(title)}</h2></div><button class="dialog-close" type="button" aria-label="关闭">×</button></div><div class="dialog-body">${body}</div>`;
  dialogContent.querySelector('.dialog-close').onclick = () => dialog.close();
  if (!dialog.open) dialog.showModal();
}
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });

let locationCard, openLocation, renderHome, showOpening, renderLocations, renderScene;
let showEvidence, renderArchive, renderEvidenceGrid, renderReport, renderSolution;
function bindLocationCards() { main.querySelectorAll('[data-location]').forEach(button => button.onclick = () => openLocation(button.dataset.location)); }
async function inspectEvidence(id) {
  try {
    const data = await api('/api/evidence/' + encodeURIComponent(id) + '/inspect', { body: {} });
    if (!state.progress.inspected.includes(id)) state.progress.inspected.push(id);
    showEvidence(data.evidence);
  } catch (error) { toast(error.message); }
}
function bindNote(id) {
  document.getElementById('save-note')?.addEventListener('click', async event => {
    const button = event.currentTarget;
    button.disabled = true;
    try { const content = document.getElementById('evidence-note').value; await api('/api/notes/' + encodeURIComponent(id), { method: 'PUT', body: { content } }); state.progress.notes[id] = content; toast('笔记已保存。'); } catch (error) { toast(error.message); } finally { button.disabled = false; }
  });
}
async function showIdentity(key, attach = true) {
  try {
    if (attach) { const result = await api('/api/identity', { body: { identity: key } }); if (result.profile) state.profile = result.profile; }
    const item = identityById(key);
    if (!item) throw new Error('没有找到这个调查员身份。');
    updateChrome();
    dialogShell('你的调查视角', 'NFC 特别调查员卡', `<div class="identity-card"><div class="identity-label">第四幕的休止符 · 特别调查员</div><h3>${esc(item.name)}</h3><div class="identity-english">${esc(item.english || '')}</div></div><p>${esc(item.description)}</p><p>${esc(item.prompt)}</p><ul class="identity-questions">${item.questions.map(question => `<li>${esc(question)}</li>`).join('')}</ul><p class="fine-print spaced">三种身份提供不同的阅读视角，主线内容与结案条件相同。你的调查进度已保留。</p><div class="dialog-actions"><button class="button" id="identity-continue" type="button">继续我的调查 →</button></div>`);
    document.getElementById('identity-continue').onclick = () => { dialog.close(); renderCurrent(false); };
  } catch (error) { toast(error.message); }
}
function showProfile() {
  const identity = identityById(state.profile.identity);
  dialogShell('调查员设置', '我的身份', `<form class="profile-form" id="profile-form"><label class="field-label" for="nickname">调查员昵称</label><input id="nickname" class="field" required minlength="2" maxlength="20" value="${esc(state.profile.nickname)}" autocomplete="nickname"><p class="fine-print">${esc(window.ARG_STATIC_STORAGE_WARNING || '调查进度与笔记保存在当前浏览器中。请用同一设备、同一浏览器继续；清除浏览器数据后无法自动恢复。')}</p><button class="button" type="submit">保存昵称</button></form><div class="small-rule"></div><p>当前视角：${esc(identity?.name || '特别调查员')}<br>已进入 ${state.progress.locations.length} 处地点，已收录 ${state.progress.evidence.length} 份材料。</p>${identity ? '<button class="text-button" id="profile-identity" type="button">查看身份内容 →</button>' : ''}<div class="dialog-actions"><a class="button secondary" href="#report" id="profile-report">我的结案记录 ↗</a></div>`);
  document.getElementById('profile-form').onsubmit = async event => { event.preventDefault(); const button = event.currentTarget.querySelector('button'); button.disabled = true; try { const result = await api('/api/me', { method: 'PATCH', body: { nickname: document.getElementById('nickname').value } }); state.profile = result.profile || result; updateChrome(); dialog.close(); renderCurrent(false); toast('昵称已保存。'); } catch (error) { toast(error.message); button.disabled = false; } };
  document.getElementById('profile-identity')?.addEventListener('click', () => showIdentity(state.profile.identity, false));
  document.getElementById('profile-report').onclick = () => dialog.close();
}
async function renderCurrent(scroll = true) {
  const version = ++state.renderVersion;
  const [view, id] = currentView();
  updateChrome();
  if (scroll) window.scrollTo({ top: 0, behavior: 'instant' });
  try {
    if (view === 'home') renderHome();
    else if (view === 'locations') renderLocations();
    else if (view === 'scene') { loading(); await renderScene(id, version); }
    else if (view === 'archive') { loading(); await renderArchive(version); }
    else if (view === 'report') { loading(); await renderReport(version); }
    else if (view === 'solution') { loading(); await loadEvidence(); await renderSolution(version); }
    else go('home');
  } catch (error) {
    if (version !== state.renderVersion) return;
    main.innerHTML = `<div class="page">${emptyState('暂时未能打开页面', error.message, '<button class="button secondary" type="button" id="retry-page">重新打开 ↻</button>')}</div>`;
    document.getElementById('retry-page').onclick = () => renderCurrent(false);
  }
}
async function boot() {
  try {
    const sessionPromise = getToken() ? api('/api/me').catch(error => { if (error.status === 401) { setToken(''); return api('/api/session', { body: {} }); } throw error; }) : api('/api/session', { body: {} });
    const results = await Promise.allSettled([api('/api/case'), sessionPromise]);
    for (const result of results) if (result.status === 'rejected') throw result.reason;
    state.catalog = results[0].value;
    applySession(results[1].value);
    document.getElementById('profile-button').onclick = showProfile;
    const parameters = new URLSearchParams(location.search);
    const entry = parameters.get('location');
    const identity = parameters.get('identity');
    if (entry) {
      const result = await api('/api/locations/' + encodeURIComponent(entry) + '/unlock', { body: {} });
      if (result.progress) state.progress = result.progress;
      history.replaceState(null, '', location.pathname + '#scene/' + encodeURIComponent(entry));
      toast('地点已加入调查，开始查看资料与现场。');
    } else if (identity) history.replaceState(null, '', location.pathname + (location.hash || '#home'));
    await renderCurrent(false);
    if (identity) await showIdentity(identity);
    window.addEventListener('hashchange', () => renderCurrent());
    window.addEventListener('focus', () => { if (state.profile) refreshSession().catch(() => {}); });
  } catch (error) {
    main.innerHTML = `<div class="page">${emptyState('调查档案暂未打开', error.message, '<button class="button secondary" type="button" id="retry-boot">重新打开 ↻</button>')}</div>`;
    document.getElementById('retry-boot').onclick = boot;
  }
}
document.addEventListener('DOMContentLoaded', boot, { once: true });
