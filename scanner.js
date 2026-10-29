/* Paper-record collection stays inside the current investigation and browser. */
(function () {
  'use strict';
  const points = new Set(['theatre', 'bio', 'psych', 'martial']);
  function parse(raw) {
    if (typeof raw !== 'string' || raw.length > 2048) return null;
    const value = raw.trim();
    const fixed = value.match(/^(?:ARG4:LOCATION:)?(theatre|bio|psych|martial)$/i);
    if (fixed) return fixed[1].toLowerCase();
    try {
      const url = new URL(value);
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
      const ids = url.searchParams.getAll('location');
      return ids.length === 1 && points.has(ids[0]) ? ids[0] : null;
    } catch (_) { return null; }
  }
  async function collect(raw) {
    const id = parse(raw);
    if (!id) throw new Error('这不是本次调查的社团收录码，请对准纸质档案上的二维码。');
    if (!state.catalog || !state.profile) throw new Error('调查档案正在准备，请稍后再扫。');
    const already = state.progress.locations.includes(id);
    const result = await api('/api/locations/' + encodeURIComponent(id) + '/unlock', { body: {} });
    applySession(result);
    await loadEvidence();
    return { id, already, club: locationById(id)?.club || '社团' };
  }

  const panel = document.createElement('dialog');
  panel.id = 'scan-dialog';
  panel.className = 'scan-dialog';
  panel.setAttribute('aria-labelledby', 'scan-title');
  panel.innerHTML = `<div class="scan-heading"><div><span class="eyebrow">现场纸档 · 当前调查</span><h2 id="scan-title">扫一扫，收录档案</h2></div><button class="scan-close" id="scan-close" type="button" aria-label="关闭扫一扫">×</button></div><p class="scan-intro">对准社团纸质档案上的二维码，纸档索引将直接加入“我的档案”。</p><div class="scan-camera"><video id="scan-video" muted autoplay playsinline aria-label="二维码取景画面"></video><span class="scan-target" aria-hidden="true"></span><span class="scan-camera-caption">将纸面二维码完整放入画面</span></div><p class="scan-status" id="scan-status" role="status" aria-live="polite"></p><div class="scan-options"><button class="button secondary" id="scan-start" type="button">重新开启相机</button><label class="button secondary scan-photo-button" for="scan-image">识别二维码图片<input id="scan-image" type="file" accept="image/*" capture="environment"></label></div><details class="scan-manual"><summary>相机不方便？输入纸面收录码</summary><form id="scan-code-form"><label class="sr-only" for="scan-code">纸面收录码</label><input class="field" id="scan-code" type="text" maxlength="2048" autocapitalize="characters" autocomplete="off" placeholder="输入二维码旁的英文收录码"><button class="button" type="submit">收录</button></form></details><p class="scan-footnote">无需退出网页。照片仅在当前设备上识别。</p>`;
  document.body.append(panel);
  const video = panel.querySelector('#scan-video');
  const message = panel.querySelector('#scan-status');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext?.('2d', { willReadFrequently: true }) || null;
  let session = 0;
  let cameraGeneration = 0;
  let stream = null;
  let timer = null;
  let busy = false;
  let detector = null;
  let detectorReady = false;
  let lastUnknown = '';
  const live = token => panel.open && token === session;
  function status(text, error = false) {
    message.textContent = text;
    message.classList.toggle('scan-error', error);
  }
  function stopCamera() {
    cameraGeneration++;
    clearTimeout(timer);
    timer = null;
    if (stream) stream.getTracks().forEach(track => track.stop());
    stream = null;
    video.pause();
    video.srcObject = null;
    panel.classList.remove('scan-camera-active');
  }
  function cleanup() { session++; busy = false; stopCamera(); }
  function close() { cleanup(); if (panel.open) panel.close(); }
  async function prepareDetector() {
    if (detectorReady) return;
    detectorReady = true;
    if (!window.BarcodeDetector) return;
    try {
      const formats = await window.BarcodeDetector.getSupportedFormats();
      if (formats.includes('qr_code')) detector = new window.BarcodeDetector({ formats: ['qr_code'] });
    } catch (_) { detector = null; }
  }
  async function decode(source, maxSide) {
    await prepareDetector();
    if (detector) {
      try {
        const found = await detector.detect(source);
        if (found.length) return found[0].rawValue;
      } catch (_) { detector = null; }
    }
    if (typeof window.jsQR !== 'function' || !context) throw new Error('二维码识别工具未载入，请刷新当前网页后重试。');
    const width = source.videoWidth || source.naturalWidth || source.width;
    const height = source.videoHeight || source.naturalHeight || source.height;
    if (!width || !height) return null;
    const scale = Math.min(1, maxSide / Math.max(width, height));
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    context.drawImage(source, 0, 0, canvas.width, canvas.height);
    const image = context.getImageData(0, 0, canvas.width, canvas.height);
    return window.jsQR(image.data, image.width, image.height, { inversionAttempts: 'attemptBoth' })?.data || null;
  }
  async function submit(raw, token) {
    if (!live(token) || busy) return;
    if (!parse(raw)) {
      if (lastUnknown !== raw) status('未识别到本次调查的收录码，请对准社团档案上的二维码。', true);
      lastUnknown = raw;
      return;
    }
    busy = true;
    stopCamera();
    status('已识别，正在收录纸档…');
    try {
      const result = await collect(raw);
      if (!live(token)) return;
      close();
      go('scene/' + result.id);
      toast(result.club + (result.already ? '纸档已收录，已回到对应现场。' : '纸档已收录，继续检查现场物证。'));
    } catch (error) {
      if (live(token)) status(error.message || '收录未完成，请重试。', true);
    } finally { if (live(token)) busy = false; }
  }
  async function scanFrame(token, cameraToken) {
    if (!live(token) || cameraToken !== cameraGeneration || busy) return;
    try {
      if (video.readyState >= 2) {
        const value = await decode(video, 960);
        if (!live(token) || cameraToken !== cameraGeneration) return;
        if (value) await submit(value, token);
      }
    } catch (error) {
      if (live(token) && cameraToken === cameraGeneration) {
        stopCamera();
        status(error.message || '相机画面暂时无法识别，可选择二维码图片或输入收录码。', true);
      }
    }
    if (live(token) && cameraToken === cameraGeneration && !busy) timer = setTimeout(() => scanFrame(token, cameraToken), 180);
  }
  async function startCamera() {
    if (!panel.open || busy) return;
    stopCamera();
    const token = session;
    const cameraToken = cameraGeneration;
    lastUnknown = '';
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      status('当前打开方式无法调用相机。请用 HTTPS 玩家网址或本机试玩入口；也可在这里识别二维码图片、输入纸面收录码。', true);
      return;
    }
    status('请允许使用相机，开启后对准纸质档案上的二维码。');
    try {
      const next = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } } });
      if (!live(token) || cameraToken !== cameraGeneration) { next.getTracks().forEach(track => track.stop()); return; }
      stream = next;
      video.srcObject = next;
      await video.play();
      if (!live(token) || cameraToken !== cameraGeneration) return;
      panel.classList.add('scan-camera-active');
      status('对准档案二维码，识别后会自动收录。');
      scanFrame(token, cameraToken);
    } catch (error) {
      if (!live(token) || cameraToken !== cameraGeneration) return;
      stopCamera();
      const hint = error.name === 'NotAllowedError' || error.name === 'SecurityError'
        ? '相机权限未开启。可在浏览器中允许相机后重试，也可识别二维码图片或输入纸面收录码。'
        : error.name === 'NotFoundError' ? '没有找到可用相机。可以识别二维码图片，或输入纸面收录码。'
          : '暂时无法开启相机，可能正被其他应用占用。请重试，或选择二维码图片、输入收录码。';
      status(hint, true);
    }
  }
  function open() {
    if (!state.catalog || !state.profile) { toast('调查档案正在准备，请稍后再扫。'); return; }
    cleanup();
    if (dialog.open) dialog.close();
    panel.querySelector('#scan-code').value = '';
    panel.querySelector('#scan-image').value = '';
    panel.querySelector('.scan-manual').open = false;
    panel.showModal();
    startCamera();
  }
  panel.querySelector('#scan-close').onclick = close;
  panel.querySelector('#scan-start').onclick = startCamera;
  panel.addEventListener('close', cleanup);
  panel.addEventListener('cancel', close);
  panel.addEventListener('click', event => {
    if (event.target !== panel) return;
    const box = panel.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close();
  });
  panel.querySelector('#scan-code-form').onsubmit = event => {
    event.preventDefault();
    submit(panel.querySelector('#scan-code').value, session);
  };
  panel.querySelector('#scan-image').addEventListener('click', () => { stopCamera(); });
  panel.querySelector('#scan-image').onchange = async event => {
    const file = event.target.files?.[0];
    if (!file || busy) return;
    stopCamera();
    const token = session;
    const imageToken = cameraGeneration;
    status('正在识别图片中的二维码…');
    const image = new Image();
    const imageURL = URL.createObjectURL(file);
    try {
      await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; image.src = imageURL; });
      const value = await decode(image, 1800);
      if (!live(token) || imageToken !== cameraGeneration) return;
      if (!value) status('图片中没有识别到二维码。请拍清楚整个二维码，或输入纸面收录码。', true);
      else await submit(value, token);
    } catch (_) { if (live(token)) status('这张图片暂时无法识别，请换一张清晰照片或输入纸面收录码。', true); }
    finally { URL.revokeObjectURL(imageURL); event.target.value = ''; }
  };
  document.addEventListener('click', event => {
    if (event.target.closest('[data-open-scanner]')) open();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopCamera(); });
  window.addEventListener('pagehide', close);
  window.addEventListener('hashchange', () => { if (panel.open) close(); });
  window.ARGScanner = { parse, collect, open, close };
})();
