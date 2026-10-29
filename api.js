/* Static player adapter. All progress stays in this browser; no server requests. */
'use strict';
const ARG_STATIC_STORAGE_KEY = 'fourth_act_github_static_v1';
const ARGLocal = (() => {
  let memory = null;
  let storageUnavailable = false;
  let warningShown = false;
  const copy = value => JSON.parse(JSON.stringify(value));
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const fail = (status, message) => { const error = new Error(message); error.status = status; throw error; };
  const timestamp = () => new Date().toISOString();
  const rewardMessage = '请向现场工作人员出示本页结案记录，人工核验后登记纪念卡；是否领取及剩余数量以现场记录为准。';
  function warnStorage(message) {
    window.ARG_STATIC_STORAGE_WARNING = message;
    if (!warningShown) {
      warningShown = true;
      // Let the initial page finish rendering before showing the warning.
      setTimeout(() => toast(message), 50);
    }
  }
  function validSession(value) {
    const progress = value?.progress;
    return value?.version === 1 && typeof value.token === 'string' && value.token.length > 0 &&
      value.profile && typeof value.profile.id === 'string' && typeof value.profile.nickname === 'string' &&
      progress && Array.isArray(progress.locations) && Array.isArray(progress.evidence) &&
      Array.isArray(progress.inspected) && progress.notes && typeof progress.notes === 'object';
  }
  function read() {
    if (!storageUnavailable) {
      try {
        const raw = localStorage.getItem(ARG_STATIC_STORAGE_KEY);
        if (!raw) { memory = null; return null; }
        const value = JSON.parse(raw);
        if (!validSession(value)) throw new Error('invalid local save');
        memory = value;
      } catch (_) {
        // Do not overwrite an unreadable save; retain this page's progress.
        storageUnavailable = true;
        warnStorage('浏览器存档暂时无法读取。当前页面仍可调查，关闭或刷新后进度可能丢失。');
      }
    }
    return memory;
  }
  function save(session) {
    memory = session;
    if (!storageUnavailable) {
      try { localStorage.setItem(ARG_STATIC_STORAGE_KEY, JSON.stringify(session)); }
      catch (_) {
        storageUnavailable = true;
        warnStorage('浏览器无法保存进度。当前页面仍可调查，关闭或刷新后进度会丢失。');
      }
    }
  }
  function uniqueId() {
    return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID() : Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
  }
  function content() {
    const data = window.ARG_GAME_DATA;
    if (!data?.CASE || !data.EVIDENCE || !data.LOCATIONS) fail(503, '调查资料未载入，请检查网站文件是否上传完整。');
    return data;
  }
  function text(value, label, maximum, minimum = 0) {
    if (typeof value !== 'string') fail(422, label + '格式不正确');
    const result = value.trim();
    if (Array.from(result).length < minimum) fail(422, label + '请填写至少' + minimum + '个字');
    if (Array.from(value).length > maximum) fail(422, label + '不能超过' + maximum + '个字');
    return result;
  }
  function body(options, allowed, required = allowed) {
    const input = options.body ?? {};
    if (!input || typeof input !== 'object' || Array.isArray(input) ||
      Object.keys(input).some(key => !allowed.includes(key)) || required.some(key => !own(input, key))) {
      fail(422, '提交字段不完整或格式不正确');
    }
    return input;
  }
  const locationData = item => ({ ...item, document_count: item.documents.length, physical_count: item.physical.length });
  function snapshot(session, token = false) {
    return { ...(token ? { token: session.token } : {}), profile: session.profile, progress: session.progress };
  }
  function readiness(data, progress) {
    const missingLocations = data.LOCATIONS.filter(item => !progress.locations.includes(item.id)).map(item => item.id);
    const missing = data.REQUIRED_EVIDENCE.filter(id => !progress.evidence.includes(id));
    const missingEvidence = data.LOCATIONS.flatMap(location => [...location.documents, ...location.physical]
      .filter(id => missing.includes(id)).map(id => ({ id, title: data.EVIDENCE[id].title, location_id: location.id, club: location.club })));
    return { ready: !missingLocations.length && !missing.length, missing_locations: missingLocations,
      missing_evidence: missingEvidence, missing_evidence_count: missing.length };
  }
  function handle(path, options) {
    if (typeof path !== 'string' || !path.startsWith('/api/')) fail(404, '没有这个静态调查功能');
    const method = String(options.method || (options.body !== undefined ? 'POST' : 'GET')).toUpperCase();
    const route = path.split('?')[0];
    const data = content();
    let match;
    if (route.startsWith('/api/staff/')) fail(404, '纯静态玩家网站没有工作人员入口');
    if (route.startsWith('/api/discussions')) fail(410, '纯静态版已取消线上讨论，请在现场交流');
    if (route === '/api/report') fail(410, '请使用结案推理完成调查；纪念卡由现场工作人员人工登记');
    if (route === '/api/health' && method === 'GET') return { ok: true, service: 'fourth-act-static-player', storage: 'browser' };
    if (route === '/api/case' && method === 'GET') return {
      case: data.CASE, locations: data.LOCATIONS.map(locationData), identities: data.IDENTITIES,
      reward: { total: 30, remaining: null, manual: true,
        rules: '完成搜证与结案后，请向现场工作人员出示结案记录，人工核验并登记纪念卡。全场限量30张、三类身份各10张；是否领取及剩余数量以现场登记为准。' },
    };
    let session = read();
    if (route === '/api/session' && method === 'POST') {
      const input = body(options, ['nickname'], []);
      if (!session) {
        const id = 'local-' + uniqueId();
        const nickname = input.nickname != null ? text(input.nickname, '昵称', 24, 1) : '调查员' + (1000 + Math.floor(Math.random() * 9000));
        session = { version: 1, token: id, profile: { id, nickname, identity: null, closed: false },
          progress: { locations: [], evidence: [], inspected: [], notes: {}, report: null } };
        save(session);
      }
      return snapshot(session, true);
    }
    if (!session) fail(401, '请先创建本地调查身份');
    const progress = session.progress;
    const location = id => data.LOCATIONS.find(item => item.id === id) || fail(404, '没有这个调查地点');
    const evidence = id => own(data.EVIDENCE, id) ? data.EVIDENCE[id] : fail(404, '没有这份证据');
    const decoded = id => { try { return decodeURIComponent(id); } catch (_) { return fail(422, '地点或材料编号格式不正确'); } };
    const unlocked = id => { if (!progress.locations.includes(id)) fail(403, '请先到对应摊位扫码登记调查地点'); };
    const add = (list, id) => { if (!list.includes(id)) list.push(id); };
    if (route === '/api/me' && method === 'GET') return snapshot(session);
    if (route === '/api/me' && method === 'PATCH') {
      session.profile.nickname = text(body(options, ['nickname']).nickname, '昵称', 24, 1);
      save(session);
      return { profile: session.profile };
    }
    if ((match = route.match(/^\/api\/locations\/([^/]+)\/unlock$/)) && method === 'POST') {
      body(options, [], []);
      const item = location(decoded(match[1]));
      add(progress.locations, item.id);
      for (const id of item.documents) { add(progress.evidence, id); add(progress.inspected, id); }
      save(session);
      return { location: locationData(item), documents: item.documents.map(evidence), progress };
    }
    if ((match = route.match(/^\/api\/locations\/([^/]+)$/)) && method === 'GET') {
      const item = location(decoded(match[1]));
      unlocked(item.id);
      return { location: locationData(item), documents: item.documents.map(evidence), progress };
    }
    if ((match = route.match(/^\/api\/evidence\/([^/]+)\/(inspect|collect)$/)) && method === 'POST') {
      body(options, [], []);
      const item = evidence(decoded(match[1]));
      unlocked(item.location_id);
      if (match[2] === 'inspect') { add(progress.inspected, item.id); save(session); return { evidence: item }; }
      if (!progress.inspected.includes(item.id)) fail(409, '请先查看现场物品，再收录这份证据');
      add(progress.evidence, item.id);
      save(session);
      return { evidence: item, progress };
    }
    if (route === '/api/evidence' && method === 'GET') return { evidence: progress.evidence.filter(id => own(data.EVIDENCE, id)).map(evidence) };
    if ((match = route.match(/^\/api\/notes\/([^/]+)$/)) && method === 'PUT') {
      const id = decoded(match[1]);
      evidence(id);
      if (!progress.evidence.includes(id)) fail(403, '请先收录这份证据');
      progress.notes[id] = text(body(options, ['content']).content, '笔记', 2000);
      save(session);
      return { ok: true };
    }
    if (route === '/api/identity' && method === 'POST') {
      const id = body(options, ['identity']).identity;
      if (typeof id !== 'string' || !own(data.IDENTITIES, id)) fail(404, '没有这个调查员身份');
      session.profile.identity = id;
      save(session);
      return { identity: data.IDENTITIES[id], profile: session.profile };
    }
    if (route === '/api/inference' && method === 'GET') {
      const ready = readiness(data, progress);
      return { ...ready, questions: ready.ready ? data.INFERENCE_QUESTIONS : [], responsibility: data.RESPONSIBILITY_QUESTION };
    }
    if (route === '/api/inference' && method === 'POST') {
      // A completed record is immutable within this browser's investigation.
      if (session.profile.closed) return { passed: true, report: progress.report, ...snapshot(session), remaining: null, manual: true };
      const input = body(options, ['answers', 'responsibility']);
      if (!readiness(data, progress).ready) fail(409, '请先登记四份纸档，并收齐关键现场物证');
      if (!input.answers || typeof input.answers !== 'object' || Array.isArray(input.answers) ||
        Object.keys(input.answers).length !== data.INFERENCE_QUESTIONS.length ||
        !data.INFERENCE_QUESTIONS.every(question => own(input.answers, question.id))) fail(422, '请完成三道事实判断');
      for (const question of data.INFERENCE_QUESTIONS) {
        if (!question.options.some(option => option.id === input.answers[question.id])) fail(422, '请选择题目中提供的选项');
      }
      const responsibility = data.RESPONSIBILITY_QUESTION.options.find(option => option.id === input.responsibility);
      if (!responsibility) fail(422, '请选择你的责任判断');
      const feedback = data.INFERENCE_QUESTIONS.map(question => ({ id: question.id, correct: input.answers[question.id] === data.INFERENCE_ANSWERS[question.id] }));
      if (!feedback.every(item => item.correct)) return { passed: false, feedback, ...snapshot(session) };
      const labels = Object.fromEntries(data.INFERENCE_QUESTIONS.map(question => [question.id, question.options.find(option => option.id === input.answers[question.id]).label]));
      progress.report = { id: 'closing-' + session.profile.id, profile_id: session.profile.id, nickname: session.profile.nickname,
        status: 'approved', finding: labels.cause, responsible: responsibility.label,
        reason: labels.chain + '；知情依据：' + labels.proof + '。责任立场由玩家自主选择。',
        evidence_ids: progress.evidence.filter(id => own(data.EVIDENCE, id) && !data.EVIDENCE[id].hidden),
        staff_comment: '当前浏览器已完成事实核对；纪念卡须现场人工核验登记', created_at: timestamp(),
        reward: { manual: true, eligible: false, identity: null, message: rewardMessage } };
      session.profile.closed = true;
      save(session);
      return { passed: true, report: progress.report, ...snapshot(session), remaining: null, manual: true };
    }
    if (route === '/api/solution' && method === 'GET') {
      if (!session.profile.closed) fail(403, '完整结案档案在完成结案推理后开放');
      return data.SOLUTION;
    }
    fail(404, '没有这个静态调查功能');
  }
  return { token: () => read()?.token || '', request: (path, options) => copy(handle(path, options)) };
})();
function getToken() { return ARGLocal.token(); }
function setToken(token) { window.argMemoryToken = token || ''; }
async function api(path, options = {}) { return ARGLocal.request(path, options); }
function esc(value) { return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }
let toastTimer;
function toast(message) { const node = document.getElementById('toast'); if (!node) return; node.textContent = message; node.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove('visible'), 5000); }
function formatTime(value) { if (!value) return ''; const date = new Date(value); return Number.isNaN(date.getTime()) ? String(value).replace('T', ' ').slice(5, 16) : date.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }); }
