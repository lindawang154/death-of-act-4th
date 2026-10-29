/* Black / silver edition. Paper records and visual discoveries are separate channels. */
(function () {
  'use strict';
  state.archiveChannel = 'physical';
  state.inferenceAnswers = {};
  state.responsibility = '';
  state.inferenceAttempts = {};
  const paperIds = () => state.catalog.locations.flatMap(item => item.documents || []);
  const visualIds = () => state.catalog.locations.flatMap(item => item.physical || []).filter(id => id !== 'debate-draft');
  const paperCount = () => paperIds().filter(hasEvidence).length;
  const visualCount = () => visualIds().filter(hasEvidence).length;
  const paperIcon = '<span class="dossier-icon" aria-hidden="true"><svg viewBox="0 0 42 52" fill="none"><path d="M7 2h20l9 9v39H7z" stroke="currentColor"/><path d="M27 2v10h9M13 23h17M13 30h17M13 37h12" stroke="currentColor"/></svg></span>';
  const pageTitle = (eyebrow, title, caption = '', action = '') => `<div class="page-title"><div><div class="eyebrow">${esc(eyebrow)}</div><h1>${esc(title)}</h1>${caption ? `<p>${esc(caption)}</p>` : ''}</div>${action}</div>`;
  function briefNote(id) {
    const note = state.progress.notes?.[id] || '';
    return `<details class="notes-details" ${note ? 'open' : ''}><summary>我的笔记${note ? ' · 已保存' : ''}</summary><div class="note-input"><div class="note-head"><span>仅自己可见</span><button class="text-button" type="button" id="save-note">保存</button></div><textarea id="evidence-note" maxlength="1000" placeholder="记下时间、页码或一个矛盾点。">${esc(note)}</textarea></div></details>`;
  }
  function media(item, loading = 'lazy') {
    const labels = (item.image_labels || []).map(label => `<span class="image-label" style="left:${Math.min(95, Math.max(0, Number(label.x) || 0))}%;top:${Math.min(95, Math.max(0, Number(label.y) || 0))}%">${esc(label.text)}</span>`).join('');
    return `<figure class="evidence-photo"><img src="${esc(item.image_url || './assets/evidence/theatre-script.webp')}" alt="${esc(item.alt || item.title)}" loading="${loading}"><div class="image-labels">${labels}</div></figure>`;
  }
  function paperCard(item) {
    return `<button class="archive-paper-card" type="button" data-open-record="${esc(item.id)}">${paperIcon}<span class="archive-paper-copy"><span class="archive-file-number">${esc(item.file_no || item.archive_no || '')} · 现场阅览件</span><strong>${esc(item.title)}</strong><span>${esc(item.summary || '')}</span><small>${item.page_count || (item.sections || []).length} 页 · ${(item.sections || []).length} 份文书${state.progress.notes?.[item.id] ? ' · 有笔记' : ''}</small></span><span class="archive-card-arrow" aria-hidden="true">↗</span></button>`;
  }
  function bindRecords(scope = main) {
    scope.querySelectorAll('[data-open-record]').forEach(button => button.onclick = () => inspectEvidence(button.dataset.openRecord));
  }
  locationCard = function (item) {
    const entered = state.progress.locations.includes(item.id);
    const count = (item.physical || []).filter(id => id !== 'debate-draft' && hasEvidence(id)).length;
    return `<button class="location-card" data-location="${esc(item.id)}" type="button"><div class="location-art" aria-hidden="true">${window.ARGScenes?.render(item.id, state.progress.evidence) || ''}</div><div class="location-card-body"><span class="club">${esc(item.club)}</span><div class="location-title"><h3>${esc(item.name)}</h3><span aria-hidden="true">↗</span></div><div class="location-meta"><span>${entered ? '纸档已登记' : '摊位扫码进入'}</span><span>物证 ${count} / 2</span></div></div></button>`;
  };
  openLocation = function (id) {
    if (state.progress.locations.includes(id)) { go('scene/' + id); return; }
    const item = locationById(id);
    dialogShell(item.name, item.club, `<p>到${esc(item.club)}摊位阅读纸档，点击“扫一扫”对准纸面二维码，直接收录档案并开启现场。</p><div class="dialog-actions"><button class="button" type="button" data-open-scanner>扫一扫收录纸档</button><button class="button secondary" id="locked-close" type="button">稍后再去</button></div>`);
    document.getElementById('locked-close').onclick = () => dialog.close();
  };
  renderHome = function () {
    const identity = identityById(state.profile.identity);
    const status = state.profile.closed ? '已结案' : state.progress.locations.length ? '调查中' : '待启程';
    main.innerHTML = `<div class="lobby-shell"><section class="lobby-hero"><div class="lobby-copy"><div class="eyebrow">社团文化节 · 微型 ARG</div><h1><span>第四幕的</span><span>休止符</span></h1><p>首演中止，调查继续。</p></div><img class="lobby-orbit" src="./assets/orbit.svg" alt="" aria-hidden="true"></section><div class="lobby-progress"><span class="lobby-state">${status}</span><span>纸档 <b>${paperCount()}</b><small>/ 4</small></span><span>物证 <b>${visualCount()}</b><small>/ 8</small></span>${identity ? `<button class="text-button lobby-identity" id="lobby-identity" type="button">${esc(identity.name)} ↗</button>` : ''}</div><nav class="lobby-actions" aria-label="调查入口"><a class="lobby-action" href="#locations"><span class="lobby-action-mark" aria-hidden="true">⌖</span><span><strong>现场搜证</strong><small>${state.progress.locations.length} / 4 处地点</small></span><span class="lobby-action-arrow" aria-hidden="true">↗</span></a><a class="lobby-action" href="#archive"><span class="lobby-action-mark" aria-hidden="true">▤</span><span><strong>我的档案</strong><small>纸档与物证</small></span><span class="lobby-action-arrow" aria-hidden="true">↗</span></a><button class="lobby-action" id="lobby-information" type="button"><span class="lobby-action-mark" aria-hidden="true">◌</span><span><strong>案情与人物</strong><small>调查之前</small></span><span class="lobby-action-arrow" aria-hidden="true">↗</span></button><a class="lobby-action" href="#report"><span class="lobby-action-mark" aria-hidden="true">✧</span><span><strong>${state.profile.closed ? '查看结案' : '结案推理'}</strong><small>${state.profile.closed ? '事实解析' : '点选完成'}</small></span><span class="lobby-action-arrow" aria-hidden="true">↗</span></a></nav></div>`;
    const scanAction = main.querySelector('.lobby-actions > a[href="#locations"]');
    if (scanAction) scanAction.outerHTML = '<button class="lobby-action" type="button" data-open-scanner><span class="lobby-action-mark" aria-hidden="true">⌗</span><span><strong>扫一扫收档</strong><small>对准纸质档案二维码</small></span><span class="lobby-action-arrow" aria-hidden="true">↗</span></button>';
    document.getElementById('lobby-information').onclick = () => showLobbyInformation('case');
    document.getElementById('lobby-identity')?.addEventListener('click', () => showIdentity(state.profile.identity, false));
  };
  function showLobbyInformation(tab, personId) {
    const caseFile = state.catalog.case || {};
    const characters = state.catalog.case.characters || [];
    const selected = characters.find(character => character.id === personId) || characters[0];
    const list = values => (values || []).map(value => `<li>${esc(value)}</li>`).join('');
    const field = (name, value) => `<div><dt>${esc(name)}</dt><dd>${esc(value || '待核实')}</dd></div>`;
    const content = tab === 'people'
      ? `<div class="lobby-people"><nav class="lobby-person-tabs" aria-label="选择人物">${characters.map(character => `<button type="button" data-person="${esc(character.id)}" class="${selected?.id === character.id ? 'active' : ''}" aria-pressed="${selected?.id === character.id}">${esc(character.name)}</button>`).join('')}</nav>${selected ? `<article class="archive-sheet person-sheet"><div class="archive-head"><span>PERSONNEL RECORD · 人物记录</span><span class="archive-stamp">虚构档案</span></div><div class="person-layout"><figure class="person-portrait"><div class="person-portrait-image" role="img" aria-label="${esc(selected.name)}的人物剪影" style="background-position:${Math.max(0, Math.min(4, Number(selected.portrait_index ?? characters.indexOf(selected)) || 0)) * 25}% center"></div><figcaption>人物示意 · 非真实影像</figcaption></figure><div><h3>${esc(selected.name)}</h3><p class="archive-number">${esc(selected.archive_no || '人物档案')} · ${esc(selected.status || selected.club || '')}</p><dl class="archive-fields">${field('年龄', selected.age ? String(selected.age) + '岁' : '')}${field('年级', selected.grade)}${field('专业', selected.major)}${field('社团', selected.club)}${field('项目角色', selected.project_role || selected.role)}</dl></div></div>${selected.relations?.length ? `<section><h4>人物关系</h4><ul>${list(selected.relations)}</ul></section>` : ''}${selected.known_facts?.length ? `<section><h4>已知事实</h4><ul>${list(selected.known_facts)}</ul></section>` : ''}<section><h4>口述记录</h4><blockquote>${esc(selected.statement || '暂无记录')}</blockquote><p class="archive-source">来源：${esc(selected.statement_source || '人物口述，待进一步核实')}</p></section></article>` : ''}</div>`
      : `<article class="archive-sheet case-sheet"><div class="archive-head"><span>CASE FILE · 案件记录</span><span class="archive-stamp">虚构档案</span></div><h3>${esc(caseFile.title || '第四幕的休止符')}</h3><p class="archive-number">档案编号：${esc(caseFile.archive_no || 'HC-1018-04')}　／　记录状态：待复核</p><section><h4>案情摘要</h4>${(caseFile.opening || [caseFile.description]).filter(Boolean).slice(0, 2).map(text => `<p>${esc(text)}</p>`).join('')}</section><section><h4>时间记录</h4><ol class="archive-timeline">${(caseFile.timeline || []).map(item => `<li><b>${esc(item.time)}</b><span>${esc(item.event)}</span></li>`).join('')}</ol></section><section><h4>调查任务</h4><p>在四个社团阅读纸档、收录线上物证，核对事故原因与行动链，最后提出自己的责任判断。</p></section><p class="archive-source">本档案与人物均为虚构，非现实公文。纸档全文请在摊位阅读。</p></article>`;
    dialogShell(tab === 'people' ? '人物档案' : '案件档案', '调查资料', `<nav class="lobby-information-tabs" aria-label="案情与人物"><button class="${tab === 'case' ? 'active' : ''}" type="button" data-information="case">案件</button><button class="${tab === 'people' ? 'active' : ''}" type="button" data-information="people">人物</button></nav>${content}`);
    if (tab === 'people' && selected?.status === '已故') {
      const heading = [...dialogContent.querySelectorAll('.person-sheet h4')].find(item => item.textContent === '口述记录');
      if (heading) heading.textContent = '记录摘要';
    }
    dialogContent.querySelectorAll('[data-information]').forEach(button => button.onclick = () => showLobbyInformation(button.dataset.information));
    dialogContent.querySelectorAll('[data-person]').forEach(button => button.onclick = () => {
      const person = button.dataset.person;
      showLobbyInformation('people', person);
      dialogContent.querySelector(`[data-person="${person}"]`)?.focus();
    });
  }
  const previousRenderCurrent = renderCurrent;
  renderCurrent = async function (scroll = true) {
    const home = currentView()[0] === 'home';
    document.body.classList.toggle('home-mode', home);
    document.documentElement.classList.toggle('home-mode', home);
    if (home) window.scrollTo({ top: 0, behavior: 'instant' });
    return previousRenderCurrent(scroll);
  };
  showOpening = function () {
    dialogShell('第四幕的休止符', '案情', `<p>《笼中鸟》首演当晚，林知夏在第四幕遭遇威亚装置失效，抢救无效死亡。最初的说明将其归为设备老化。</p><p>一张后台照片、一份改过的流程单，让这个结论有了疑点。</p><div class="small-rule"></div><p>纸档在摊位阅读，物证在线搜索。点击网页内“扫一扫”，扫描纸质档案上的二维码，索引会直接加入当前调查。</p><p class="fine-print">本案及人物均为虚构。</p><div class="dialog-actions"><button class="button" id="opening-start" type="button">开始调查 ↗</button></div>`);
    document.getElementById('opening-start').onclick = () => { dialog.close(); go('locations'); };
  };
  renderLocations = function () {
    main.innerHTML = `<div class="page">${pageTitle('四个社团', '现场搜证', '纸档在摊位阅读，物证在场景中发现。', '<a class="text-button" href="#archive">我的档案 ↗</a>')}<div class="scan-booth-notice"><p>在摊位阅读纸档，再点击“扫一扫”扫描纸面二维码；收录后继续在当前网页调查。</p><button class="scan-open-button" type="button" data-open-scanner>扫一扫收录纸档</button></div><div class="location-grid full-locations">${state.catalog.locations.map(item => locationCard(item)).join('')}</div></div>`;
    bindLocationCards();
  };
  renderScene = async function (id, version) {
    const item = locationById(id);
    if (!item) throw new Error('没有这个地点。');
    if (!state.progress.locations.includes(id)) { renderLocations(); openLocation(id); return; }
    const data = await api('/api/locations/' + encodeURIComponent(id));
    if (version !== state.renderVersion) return;
    if (data.progress) state.progress = data.progress;
    const objects = (window.ARGScenes?.hotspots?.[id] || []).filter(object => object.id !== 'debate-draft');
    main.innerHTML = `<div class="page"><div class="crumb"><a href="#locations">现场搜证</a><span>/</span><span>${esc(item.club)}</span></div>${pageTitle(item.club, item.name, '', '<a class="text-button" href="#archive">我的档案 ↗</a>')}<div class="scene-layout"><section class="scene-frame" aria-label="可交互现场"><div class="scene-toolbar"><span>现场物证</span><span>${objects.filter(object => hasEvidence(object.id)).length} / 2</span><button class="text-button" id="scene-zoom" type="button">放大 ⊕</button></div><div class="scene-container" id="scene-container">${window.ARGScenes?.render(id, state.progress.evidence) || ''}</div><div class="scene-caption"><span>拖动查看 · 点击物品检查</span></div></section><aside class="scene-side"><h2>可检查的物品</h2><div class="object-list">${objects.map(object => `<button class="object-button" data-inspect="${esc(object.id)}" type="button"><span class="object-symbol" aria-hidden="true">${hasEvidence(object.id) ? '✓' : '+'}</span><strong>${esc(object.label)}</strong><span class="object-state">${hasEvidence(object.id) ? '已收录' : '↗'}</span></button>`).join('')}${id === 'theatre' && hasEvidence('debate-draft') ? '<button class="object-button" data-inspect="debate-draft" type="button"><strong>抽屉里的旧稿</strong><span class="object-state">已收录</span></button>' : ''}</div></aside></div><section><div class="section-head"><h2>现场纸档</h2><span class="read-at-booth">正文见摊位纸档</span></div><div class="paper-dossier-list">${data.documents.map(paperCard).join('')}</div></section><div class="section-head"><a class="text-button" href="#locations">下一个地点 ↗</a><span class="fine-print">带着新发现，继续下一处调查。</span></div></div>`;
    main.querySelector('.scene-layout')?.insertAdjacentHTML('beforebegin', '<div class="scan-booth-notice"><p>本社团纸档已收录。前往下一处摊位后，可继续在这里扫一扫。</p><button class="scan-open-button" type="button" data-open-scanner>扫一扫收录下一份</button></div>');
    main.querySelectorAll('[data-inspect]').forEach(button => button.onclick = () => inspectEvidence(button.dataset.inspect));
    main.querySelectorAll('[data-evidence]').forEach(object => {
      object.onclick = () => inspectEvidence(object.dataset.evidence);
      object.onkeydown = event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); inspectEvidence(object.dataset.evidence); } };
    });
    bindRecords();
    document.getElementById('scene-zoom').onclick = event => { const zoom = document.getElementById('scene-container').classList.toggle('zoomed'); event.currentTarget.textContent = zoom ? '还原 ⊖' : '放大 ⊕'; };
    updateChrome();
  };
  showEvidence = function (item) {
    if (item.kind === 'document') { showPaperRecord(item); return; }
    const collected = hasEvidence(item.id);
    const club = locationById(item.location_id)?.club || '';
    dialogShell(item.title, `${club} · ${item.hidden ? '隐藏发现' : '现场物证'}`, `${media(item, 'eager')}<div class="evidence-facts">${(item.detail_tags || []).map(tag => `<span>${esc(tag)}</span>`).join('')}</div>${item.caption ? `<p class="artifact-caption">${esc(item.caption)}</p>` : ''}${item.hidden ? '<p class="browser-notice">你发现了额外线索。请向话剧社工作人员索取隐藏附页，阅读完整记录；此线索不影响正常结案。</p>' : `<p class="fine-print">${item.required ? '主线必需物证' : '可选补充物证'}</p>`}<div class="dialog-actions"><button type="button" class="button" id="collect-evidence" ${collected ? 'disabled' : ''}>${collected ? '✓ 已收录' : '＋ 收录物证'}</button><button class="button secondary" id="evidence-close" type="button">返回现场</button></div>${collected ? briefNote(item.id) : ''}`);
    document.getElementById('evidence-close').onclick = () => dialog.close();
    document.getElementById('collect-evidence').onclick = async event => {
      const button = event.currentTarget;
      button.disabled = true;
      try {
        const result = await api('/api/evidence/' + encodeURIComponent(item.id) + '/collect', { body: {} });
        if (result.progress) state.progress = result.progress;
        await loadEvidence();
        await renderCurrent(false);
        showEvidence(result.evidence || item);
        toast('物证已收录');
      } catch (error) { toast(error.message); if (button.isConnected) button.disabled = false; }
    };
    bindNote(item.id);
  };
  function showPaperRecord(item) {
    dialogShell(item.title, `${locationById(item.location_id)?.club || ''} · 纸档索引`, `<div class="archive-registration"><div class="archive-registration-head"><span>${esc(item.file_no || item.archive_no || '')}</span><span>✓ 已登记</span></div><p>${esc(item.summary || '')}</p><ol class="archive-directory">${(item.sections || []).map((section, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span><strong>${esc(section)}</strong></li>`).join('')}</ol><p class="archive-booth-note">完整文书请在${esc(locationById(item.location_id)?.club || '社团')}摊位阅读，红色文字为重点核查处。</p></div>${briefNote(item.id)}<div class="dialog-actions"><button class="button secondary" id="record-close" type="button">返回档案</button><a class="text-button" href="#scene/${encodeURIComponent(item.location_id)}" id="record-scene">前往对应现场 ↗</a></div>`);
    document.getElementById('record-close').onclick = () => dialog.close();
    document.getElementById('record-scene').onclick = () => dialog.close();
    bindNote(item.id);
  }
  renderArchive = async function (version) {
    await loadEvidence();
    if (version !== state.renderVersion) return;
    main.innerHTML = `<div class="page archive-page">${pageTitle('调查资料库', '我的档案', '按社团归档，随时回看已收录的线索。', `<a class="button secondary" href="#report">${state.profile.closed ? '查看结案' : '整理结案'} ↗</a>`)}<div class="archive-workspace"><nav class="archive-folders" aria-label="按社团查阅"><span class="archive-folder-label">卷宗目录</span><button class="archive-folder ${state.archiveFilter === 'all' ? 'active' : ''}" data-filter="all" type="button" aria-pressed="${state.archiveFilter === 'all'}"><span>全部材料</span><small>${paperCount() + visualCount()}</small></button>${state.catalog.locations.map(item => `<button class="archive-folder ${state.archiveFilter === item.id ? 'active' : ''}" data-filter="${esc(item.id)}" type="button" aria-pressed="${state.archiveFilter === item.id}"><span>${esc(item.club)}</span><small>${state.evidence.filter(record => record.location_id === item.id && !record.hidden).length} / 3</small></button>`).join('')}<p>纸档在摊位阅读。<br>这里保存索引、照片与个人笔记。</p></nav><section class="archive-contents" aria-label="归档材料"><div class="archive-tools"><div class="archive-tabs" role="group" aria-label="材料类型"><button class="${state.archiveChannel === 'physical' ? 'active' : ''}" aria-pressed="${state.archiveChannel === 'physical'}" data-channel="physical" type="button">物证照片 <span>${visualCount()} / 8</span></button><button class="${state.archiveChannel === 'paper' ? 'active' : ''}" aria-pressed="${state.archiveChannel === 'paper'}" data-channel="paper" type="button">纸档索引 <span>${paperCount()} / 4</span></button></div><label class="archive-search-label"><span class="sr-only">搜索已收录材料或笔记</span><input class="search-input" id="archive-search" type="search" placeholder="搜索标题、内容或笔记" value="${esc(state.search)}"></label></div><div class="archive-result-summary" id="archive-result-summary" aria-live="polite"></div><div id="evidence-grid"></div></section></div></div>`;
    main.querySelector('[data-filter="all"] small').textContent = state.evidence.length;
    main.querySelectorAll('[data-channel]').forEach(button => button.onclick = () => {
      state.archiveChannel = button.dataset.channel;
      main.querySelectorAll('[data-channel]').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
      renderEvidenceGrid();
    });
    main.querySelectorAll('[data-filter]').forEach(button => button.onclick = () => {
      state.archiveFilter = button.dataset.filter;
      main.querySelectorAll('[data-filter]').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
      renderEvidenceGrid();
    });
    document.getElementById('archive-search').oninput = event => { state.search = event.target.value; renderEvidenceGrid(); };
    renderEvidenceGrid();
    main.querySelector('.page-title')?.insertAdjacentHTML('beforeend', '<button class="scan-open-button" type="button" data-open-scanner>扫一扫收录纸档</button>');
  };
  renderEvidenceGrid = function () {
    const grid = document.getElementById('evidence-grid');
    if (!grid) return;
    const query = state.search.trim().toLowerCase();
    const kind = state.archiveChannel === 'paper' ? 'document' : 'physical';
    const filtered = state.evidence.filter(item => item.kind === kind && (state.archiveFilter === 'all' || state.archiveFilter === item.location_id) && (!query || [item.title, item.file_no, item.summary, item.caption, ...(item.sections || []), ...(item.detail_tags || []), locationById(item.location_id)?.club, state.progress.notes?.[item.id]].join(' ').toLowerCase().includes(query)));
    const summary = document.getElementById('archive-result-summary');
    if (summary) summary.textContent = `${state.archiveFilter === 'all' ? '全部社团' : locationById(state.archiveFilter)?.club || ''} · ${kind === 'document' ? '纸档索引' : '物证照片'} · ${filtered.length} 项${query ? '匹配结果' : '已归档'}`;
    if (!filtered.length) {
      grid.innerHTML = emptyState(query ? '没有找到匹配材料' : kind === 'document' ? '此处还没有纸档索引' : '此处还没有物证照片', query ? '试试人物姓名、档案编号，或笔记里的关键词。' : kind === 'document' ? '到社团摊位阅读文书，再点击网页内“扫一扫”收录纸档。' : '进入已解锁的现场，检查物品并收录照片。', query ? '<button class="button secondary" id="archive-clear-search" type="button">清除搜索</button>' : '<a class="button secondary" href="#locations">前往现场 ↗</a>');
      document.getElementById('archive-clear-search')?.addEventListener('click', () => { state.search = ''; document.getElementById('archive-search').value = ''; renderEvidenceGrid(); document.getElementById('archive-search').focus(); });
      return;
    }
    grid.innerHTML = state.catalog.locations.map(location => {
      const items = filtered.filter(item => item.location_id === location.id).sort((a, b) => (a.file_no || '').localeCompare(b.file_no || ''));
      if (!items.length) return '';
      return `<section class="archive-group"><div class="archive-group-heading"><h2>${esc(location.club)}</h2><span>${items.length} 项${kind === 'document' ? '文书索引' : '影像记录'}</span><a class="text-button" href="#scene/${encodeURIComponent(location.id)}">回到现场 ↗</a></div>${kind === 'document' ? `<div class="archive-paper-list">${items.map(paperCard).join('')}</div>` : `<div class="archive-photo-grid">${items.map(item => `<article class="archive-photo-card"><button class="archive-photo-open" data-read="${esc(item.id)}" type="button">${media(item)}<span class="archive-photo-copy"><small>${esc(item.file_no || '')}${item.hidden ? ' · 额外发现' : ''}</small><strong>${esc(item.title)}</strong><span>${esc(item.subtitle || '')}</span></span><span class="archive-card-arrow" aria-hidden="true">↗</span></button>${state.progress.notes?.[item.id] ? `<p class="archive-note-preview"><span>笔记</span>${esc(state.progress.notes[item.id])}</p>` : ''}</article>`).join('')}</div>`}</section>`;
    }).join('');
    bindRecords(grid);
    grid.querySelectorAll('[data-read]').forEach(button => button.onclick = () => inspectEvidence(button.dataset.read));
  };
  function inferenceQuestion(question, index, valueQuestion = false) {
    const selected = valueQuestion ? state.responsibility : state.inferenceAnswers[question.id];
    const feedback = state.closingFeedback?.[question.id];
    return `<fieldset class="closing-question ${feedback && !feedback.correct ? 'closing-needs-review' : ''}" id="question-${esc(question.id)}"><legend><span class="closing-question-kicker">${valueQuestion ? '第二部分 · 责任立场' : `第一部分 · 事实还原 ${index} / 3`}</span><span class="closing-question-title" id="closing-question-title" tabindex="-1">${esc(question.title)}</span></legend><p class="closing-question-note">${valueQuestion ? '选择最接近你判断的一项。这一题不设标准答案，不影响事实核对。' : '选择最符合现有记录的一项。可以返回修改，也可以打开档案核对。'}</p><div class="closing-options">${question.options.map((option, optionIndex) => `<label class="closing-option"><input type="radio" name="${valueQuestion ? 'responsibility' : esc(question.id)}" value="${esc(option.id)}" ${selected === option.id ? 'checked' : ''}><span class="closing-option-letter" aria-hidden="true">${String.fromCharCode(65 + optionIndex)}</span><span>${esc(option.label)}</span></label>`).join('')}</div><p class="closing-feedback" id="closing-feedback" role="status">${feedback && !feedback.correct ? esc(feedback.hint) : ''}</p></fieldset>`;
  }
  renderReport = async function (version) {
    await refreshSession();
    if (version !== state.renderVersion) return;
    const report = state.progress.report;
    if (state.profile.closed) {
      main.innerHTML = `<div class="page closing-page">${pageTitle('HC-1018 · 调查归档', '第四幕，已有了答案。')}<section class="closing-complete"><span class="closing-complete-mark" aria-hidden="true">✓</span><div class="closing-complete-copy"><span class="closing-kicker">调查状态 · 已结案</span><h2>你的事实判断已通过核对</h2><p class="closing-record-meta">调查员：${esc(state.profile.nickname)}${report?.created_at ? ` · ${esc(formatTime(report.created_at))}` : ''}</p><p>事故经过与行动链已完成核对。关于责任的判断，可以带到现场与同伴交流。</p>${report?.responsible ? `<div class="closing-position"><span>你留下的责任立场</span><p>${esc(report.responsible)}</p></div>` : ''}<div class="closing-reward"><span>纪念卡登记</span><p>${esc(report?.reward?.message || '请在现场向工作人员展示这份结案记录，人工核验并登记纪念卡。卡片以现场库存及登记顺序为准。')}</p></div><div class="closing-actions"><a class="button" href="#solution">阅读完整解析 ↗</a><a class="button secondary" href="#archive">回看我的档案</a></div></div></section><a class="text-button closing-back-link" href="#archive">回看我的档案 ↗</a></div>`;
      return;
    }
    const inference = await api('/api/inference');
    if (version !== state.renderVersion) return;
    if (!inference.ready) {
      const missingLocations = inference.missing_locations || [];
      const missingEvidence = inference.missing_evidence || [];
      const groups = state.catalog.locations.filter(item => missingLocations.includes(item.id) || missingEvidence.some(evidence => evidence.location_id === item.id));
      main.innerHTML = `<div class="page closing-page">${pageTitle('结案之前', '把缺少的记录补齐', '登记四份现场纸档，并收录关键图片物证后，即可开始结案。')}<div class="closing-readiness"><span>现场纸档 <b>${paperCount()}<small> / 4</small></b></span><span>图片物证 <b>${visualCount()}<small> / 8</small></b></span><p>下方只列结案必需的项目；补充物证与隐藏发现不影响通关。</p></div><section class="closing-missing-grid" aria-label="待补齐的记录">${groups.map(item => { const locked = missingLocations.includes(item.id); const evidence = missingEvidence.filter(entry => entry.location_id === item.id); return `<article class="closing-missing-card"><div class="closing-missing-head"><h2>${esc(item.club)}</h2><span>${locked ? '尚未登记' : '继续收录'}</span></div><ul>${locked ? '<li>到摊位阅读纸档，点击网页内“扫一扫”收录。</li>' : ''}${evidence.map(entry => `<li>检查并收录：${esc(entry.title)}</li>`).join('')}</ul><a class="text-button" href="${locked ? '#locations' : '#scene/' + encodeURIComponent(item.id)}">${locked ? '查看点位位置' : '返回场景检查'} ↗</a></article>`; }).join('')}</section><a class="button secondary" href="#locations">继续现场搜证 ↗</a></div>`;
      return;
    }
    const questions = [...inference.questions, inference.responsibility];
    const stepNames = ['事故原因', '行动链条', '知情依据', '责任立场'];
    const draftKey = 'fourth_act_static_inference_draft_' + location.pathname + '_' + state.profile.id;
    if (!state.closingDraftLoaded) {
      try { const draft = JSON.parse(localStorage.getItem(draftKey) || 'null'); if (draft) { state.inferenceAnswers = draft.answers || {}; state.responsibility = draft.responsibility || ''; } } catch (_) {}
      state.closingDraftLoaded = true;
    }
    const selectedValue = question => question.id === 'responsibility' ? state.responsibility : state.inferenceAnswers[question.id];
    const chosen = question => question.options.find(option => option.id === selectedValue(question));
    const answeredCount = () => questions.filter(chosen).length;
    const saveDraft = () => { try { localStorage.setItem(draftKey, JSON.stringify({ answers: state.inferenceAnswers, responsibility: state.responsibility })); } catch (_) {} };
    state.closingStep = Math.max(0, Math.min(4, state.closingStep || 0));
    state.closingFeedback ||= {};
    let submitting = false;
    let errorText = '';
    function paint(focus = false) {
      if (version !== state.renderVersion) return;
      const step = state.closingStep;
      const reviewing = step === 4;
      main.innerHTML = `<div class="page closing-page">${pageTitle('HC-1018 · 结案记录', reviewing ? '提交前，再看一遍。' : '让记录组成你的判断', reviewing ? '核对四项选择，确认后提交。事实题通过后即可结案。' : '先还原三项事实，再留下你的责任立场。', '<a class="text-button" href="#archive">查阅我的档案 ↗</a>')}<nav class="closing-step-nav" aria-label="结案步骤"><ol>${questions.map((question, index) => `<li><button type="button" data-closing-step="${index}" ${index === step ? 'aria-current="step"' : ''} class="${state.closingFeedback[question.id]?.correct === false ? 'closing-step-revisit' : ''}"><span>${chosen(question) ? '✓' : String(index + 1).padStart(2, '0')}</span><strong>${stepNames[index]}</strong>${state.closingFeedback[question.id]?.correct === false ? '<small>待核对</small>' : ''}</button></li>`).join('')}<li><button type="button" data-closing-step="4" ${reviewing ? 'aria-current="step"' : ''} ${answeredCount() < 4 ? 'disabled' : ''}><span>↗</span><strong>确认提交</strong></button></li></ol></nav><div class="closing-workspace"><section class="closing-form-panel"><form id="inference-form" novalidate>${reviewing ? `<div class="closing-review"><span class="closing-kicker">四项判断 · ${answeredCount()} / 4 已完成</span><h2 id="closing-question-title" tabindex="-1">这是你留下的结案记录</h2><ol>${questions.map((question, index) => `<li><div><span>${index === 3 ? '责任立场 · 自主判断' : `事实 ${index + 1} · ${stepNames[index]}`}</span><p>${esc(chosen(question)?.label || '尚未选择')}</p></div><button type="button" class="text-button" data-closing-step="${index}" aria-label="修改${stepNames[index]}">修改 ↗</button></li>`).join('')}</ol></div>` : inferenceQuestion(questions[step], step + 1, step === 3)}<p class="closing-error" id="inference-error" role="alert">${esc(errorText)}</p><div class="closing-form-footer"><button class="text-button" type="button" id="closing-previous" ${step === 0 ? 'disabled' : ''}>← 上一步</button><span id="inference-progress" aria-live="polite">${answeredCount()} / 4 已选择</span>${reviewing ? '<button class="button" type="submit">确认并提交结案 ↗</button>' : `<button class="button" type="button" id="closing-next">${step === 3 ? '核对我的选择' : '下一步'} →</button>`}</div></form></section><aside class="closing-guide"><span class="closing-kicker">${reviewing ? '提交说明' : step === 3 ? '关于责任' : '核对记录'}</span><h2>${reviewing ? '事实归档，<br>追问继续。' : step === 3 ? '同一组事实，<br>可以继续追问。' : '每一步判断，<br>都有来处。'}</h2><p>${reviewing ? '系统核对前三项事实。责任立场只记录你的选择，不设标准答案。' : step === 3 ? '你可以更看重直接行动、明知风险的决定，或事前事后的掩盖。选择体现的是你的判断标准。' : ['先核对事故说明和检查摘录，再看演出流程如何变化。', '把材料流转、现场画面和通知发布，按时间顺序连起来。', '区分当时已经收到的信息，与事后才出现的解释。'][step]}</p><div class="closing-guide-rule"></div><p class="closing-guide-small">${reviewing ? '若有事实判断需要调整，会保留全部选择并提示你回看相关记录。' : '打开档案或返回上一步时，当前选择会保留在这个浏览器中。'}</p>${reviewing ? '<p class="closing-guide-small">纪念卡由工作人员现场核验、人工登记。前30位以现场登记顺序为准；此页不预留卡片。隐藏发现不影响资格。</p>' : '<a class="text-button" href="#archive">回看档案与笔记 ↗</a>'}</aside></div></div>`;
      main.querySelectorAll('[data-closing-step]').forEach(button => button.onclick = () => { if (submitting) return; state.closingStep = Number(button.dataset.closingStep); errorText = ''; paint(true); });
      document.getElementById('closing-previous').onclick = () => { if (submitting || !state.closingStep) return; state.closingStep--; errorText = ''; paint(true); };
      document.getElementById('closing-next')?.addEventListener('click', () => {
        if (!chosen(questions[step])) { document.getElementById('inference-error').textContent = '请先选择一项，再继续。'; main.querySelector('.closing-option input')?.focus(); return; }
        state.closingStep++; errorText = ''; paint(true);
      });
      const form = document.getElementById('inference-form');
      form.onchange = event => {
        const input = event.target;
        if (!input.matches('input[type="radio"]')) return;
        if (input.name === 'responsibility') state.responsibility = input.value;
        else state.inferenceAnswers[input.name] = input.value;
        delete state.closingFeedback[input.name];
        saveDraft();
        document.getElementById('inference-progress').textContent = `${answeredCount()} / 4 已选择`;
        document.getElementById('inference-error').textContent = '';
        document.getElementById('closing-feedback').textContent = '';
        document.getElementById('question-' + input.name).classList.remove('closing-needs-review');
        const stepButton = main.querySelector(`[data-closing-step="${step}"]`);
        stepButton.classList.remove('closing-step-revisit');
        stepButton.querySelector('span').textContent = '✓';
        stepButton.querySelector('small')?.remove();
        main.querySelector('[data-closing-step="4"]').disabled = answeredCount() < 4;
      };
      form.onsubmit = async event => {
        event.preventDefault();
        if (!reviewing) { document.getElementById('closing-next')?.click(); return; }
        if (submitting) return;
        if (answeredCount() < 4) { errorText = '请完成四项选择。'; state.closingStep = questions.findIndex(question => !chosen(question)); paint(true); return; }
        submitting = true;
        const button = form.querySelector('button[type="submit"]');
        button.textContent = '正在核对…';
        main.querySelectorAll('.closing-workspace button, .closing-step-nav button').forEach(control => { control.disabled = true; });
        form.setAttribute('aria-busy', 'true');
        try {
          const answers = Object.fromEntries(inference.questions.map(question => [question.id, state.inferenceAnswers[question.id]]));
          const result = await api('/api/inference', { body: { answers, responsibility: state.responsibility } });
          applySession(result);
          if (result.passed) { try { localStorage.removeItem(draftKey); } catch (_) {} await renderCurrent(); toast('结案记录已归档'); return; }
          let firstIncorrect = -1;
          for (const feedback of result.feedback || []) {
            const index = inference.questions.findIndex(question => question.id === feedback.id);
            if (index < 0) continue;
            if (!feedback.correct) state.inferenceAttempts[feedback.id] = (state.inferenceAttempts[feedback.id] || 0) + 1;
            const hints = inference.questions[index].hints || [];
            const hint = hints[Math.min((state.inferenceAttempts[feedback.id] || 1) - 1, hints.length - 1)] || '请再对照相关纸档与图片物证。';
            state.closingFeedback[feedback.id] = { correct: feedback.correct, hint };
            if (!feedback.correct && firstIncorrect < 0) firstIncorrect = index;
          }
          state.closingStep = firstIncorrect < 0 ? 0 : firstIncorrect;
          errorText = '这项事实与现有记录还不一致。参考提示核对后，可以修改；其余选择已保留。';
        } catch (error) { errorText = error.message || '暂时无法提交，请稍后重试。你的选择已保留。'; }
        finally { submitting = false; paint(true); }
      };
      if (focus) { document.getElementById('closing-question-title')?.focus({ preventScroll: true }); document.querySelector('.closing-workspace')?.scrollIntoView({ block: 'start', behavior: 'instant' }); }
    }
    paint();
  };
  renderSolution = async function (version) {
    if (!state.profile.closed) { go('report'); return; }
    const [result] = await Promise.all([api('/api/solution'), loadEvidence()]);
    if (version !== state.renderVersion) return;
    const solution = result.solution || result;
    main.innerHTML = `<div class="page closing-page">${pageTitle('已结案 · 完整档案', solution.title, '按记录的来处，重新走一遍这条证据链。', '<a class="text-button" href="#report">我的结案记录 ↗</a>')}<p class="closing-solution-summary">${esc(solution.summary)}</p><section class="closing-chain" aria-label="完整证据链">${solution.chain.map((step, index) => { const optional = step.evidence_ids.includes('debate-draft'); return `<details class="closing-chain-step" ${index === 0 ? 'open' : ''}><summary><span class="closing-chain-number">${String(index + 1).padStart(2, '0')}</span><h2>${esc(optional && !hasEvidence('debate-draft') ? '额外发现：调查发起者的责任' : step.title.replace(/^[一二三四五六七八九十]+、/, ''))}</h2><span class="closing-chain-kind">${optional ? '可选补充' : '事实还原'}</span></summary><div class="closing-chain-body">${optional && !hasEvidence('debate-draft') ? '<p class="closing-optional-note">这部分涉及尚未发现的隐藏材料。你也可以收起这一节，继续探索现场。</p>' : ''}<p>${esc(step.body)}</p><div class="closing-chain-evidence">${step.evidence_ids.filter(hasEvidence).map(id => { const item = state.evidence.find(entry => entry.id === id); return `<button class="text-button" type="button" data-solution-evidence="${esc(id)}">${esc(item?.file_no || '')} ${esc(item?.title || '查看依据')} ↗</button>`; }).join('')}</div></div></details>`; }).join('')}</section><section class="closing-reflection-section"><div><span class="closing-kicker">事实之后 · 现场交流</span><h2>如果每个人都说，<br>“我只做了其中一件事。”</h2><p>把这些问题留到现场，和同伴交换各自的判断。</p></div><ol>${solution.discussion.map(question => `<li>${esc(question)}</li>`).join('')}</ol></section></div>`;
    main.querySelectorAll('[data-solution-evidence]').forEach(button => button.onclick = () => inspectEvidence(button.dataset.solutionEvidence));
  };
})();
