/* Local player rehearsal. Point links keep the site's repository path. */
(function () {
  'use strict';
  const localPreview = location.protocol === 'file:' || ['localhost', '127.0.0.1', '[::1]', '::1'].includes(location.hostname);
  const button = document.getElementById('entry-menu-button');
  button.hidden = !localPreview;
  document.body.classList.toggle('local-preview', localPreview);
  if (!localPreview) { button.onclick = null; return; }
  function pointLink(id) {
    const point = new URL(location.href);
    point.search = '';
    point.searchParams.set('location', id);
    point.hash = '';
    return point.href;
  }
  button.onclick = function () {
    const locations = state.catalog?.locations || [];
    dialogShell('本机试玩点位', '模拟现场扫码 · 当前浏览器进度保留', `<section class="entry-menu-section"><p>选择一个社团，登记纸档并进入对应场景。</p><div class="entry-menu-points">${locations.map(item => `<a class="entry-menu-point" href="${esc(pointLink(item.id))}"><strong>${esc(item.club)}</strong><span>${esc(item.name)} ↗</span></a>`).join('')}</div>${locations.length ? '' : '<p>点位资料正在载入，请稍后重新打开。</p>'}</section><div class="dialog-actions"><button class="button secondary" id="entry-menu-close" type="button">返回调查</button></div>`);
    document.getElementById('entry-menu-close').onclick = () => dialog.close();
  };
})();
