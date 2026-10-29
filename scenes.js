/* Code-native investigation scenes. Evidence geometry and click targets live together. */
(function () {
  'use strict';

  const locations = {
    theatre: {
      name: '《笼中鸟》剧场后台',
      hotspots: [
        { id: 'theatre-script', label: '桌上的剧本', x: 240, y: 420 },
        { id: 'theatre-rig', label: '威亚连接部位', x: 740, y: 190 },
        { id: 'debate-draft', label: '半开的文件抽屉', x: 280, y: 490 }
      ]
    },
    bio: {
      name: '生物社项目工作区',
      hotspots: [
        { id: 'bio-handoff', label: '空的周转袋', x: 520, y: 395 },
        { id: 'bio-label', label: '破损外包装', x: 785, y: 280 }
      ]
    },
    psych: {
      name: '心理社联创工作区',
      hotspots: [
        { id: 'psych-draft', label: '电脑上的通知草稿', x: 350, y: 300 },
        { id: 'psych-chat', label: '桌上的联络手机', x: 700, y: 450 }
      ]
    },
    martial: {
      name: '武术社排练区',
      hotspots: [
        { id: 'martial-video', label: '三脚架上的录像设备', x: 730, y: 330 },
        { id: 'martial-photo', label: '镜边的后台工作照', x: 270, y: 220 }
      ]
    }
  };

  function definitions(p) {
    return `<defs>
      <linearGradient id="${p}-wall" x2="0" y2="1"><stop stop-color="#23313a"/><stop offset="1" stop-color="#131e27"/></linearGradient>
      <linearGradient id="${p}-floor" x2="0.65" y2="1"><stop stop-color="#263038"/><stop offset="1" stop-color="#0b141f"/></linearGradient>
      <linearGradient id="${p}-wood" x2="0.15" y2="1"><stop stop-color="#6a574b"/><stop offset="1" stop-color="#3e3836"/></linearGradient>
      <linearGradient id="${p}-desk" x2="0.6" y2="1"><stop stop-color="#52605c"/><stop offset="1" stop-color="#2c3c3c"/></linearGradient>
      <linearGradient id="${p}-curtain" x2="1" y2="0"><stop stop-color="#271d2a"/><stop offset=".23" stop-color="#61363e"/><stop offset=".48" stop-color="#35242f"/><stop offset=".7" stop-color="#76434a"/><stop offset="1" stop-color="#2a202b"/></linearGradient>
      <linearGradient id="${p}-paper" x2=".4" y2="1"><stop stop-color="#e2d9bd"/><stop offset="1" stop-color="#a9aa94"/></linearGradient>
      <linearGradient id="${p}-glass" x2="1" y2="1"><stop stop-color="#667d7a"/><stop offset=".5" stop-color="#253c45"/><stop offset="1" stop-color="#172934"/></linearGradient>
      <linearGradient id="${p}-screen" x2="1" y2="1"><stop stop-color="#b1c2b5"/><stop offset="1" stop-color="#5c807b"/></linearGradient>
      <linearGradient id="${p}-metal" x2="1" y2="1"><stop stop-color="#a0a9a2"/><stop offset=".3" stop-color="#54696c"/><stop offset=".6" stop-color="#778985"/><stop offset="1" stop-color="#263c45"/></linearGradient>
      <radialGradient id="${p}-light"><stop stop-color="#e4c997" stop-opacity=".19"/><stop offset="1" stop-color="#e4c997" stop-opacity="0"/></radialGradient>
      <radialGradient id="${p}-vignette"><stop offset=".4" stop-color="#050b16" stop-opacity="0"/><stop offset="1" stop-color="#050b16" stop-opacity=".62"/></radialGradient>
      <filter id="${p}-shadow" x="-35%" y="-35%" width="180%" height="180%"><feDropShadow dx="0" dy="9" stdDeviation="8" flood-color="#030913" flood-opacity=".45"/></filter>
      <filter id="${p}-glow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#d8c69f" flood-opacity=".5"/></filter>
      <pattern id="${p}-grain" width="16" height="16" patternUnits="userSpaceOnUse"><path d="M2 4h1M10 11h1M5 15h1" stroke="#ddd8bc" stroke-opacity=".055" stroke-width="1"/></pattern>
      <pattern id="${p}-floorlines" width="120" height="48" patternUnits="userSpaceOnUse" patternTransform="skewX(-23)"><path d="M0 0h120M0 48V0M60 0v48" stroke="#c3b79b" stroke-opacity=".07" fill="none"/></pattern>
    </defs>
    <style>
      .arg-scene .scene-object { cursor:pointer; outline:none; }
      .arg-scene .scene-object .object-art { transition:filter .2s ease,opacity .2s ease; }
      .arg-scene .scene-object:hover .object-art,.arg-scene .scene-object:focus .object-art { filter:url(#${p}-glow); }
      .arg-scene .object-mark { transition:opacity .2s ease,transform .2s ease; }
      .arg-scene .scene-object:hover .object-mark,.arg-scene .scene-object:focus .object-mark { opacity:1; }
      .arg-scene .object-check { display:none; }
      .arg-scene .found .object-plus { display:none; }
      .arg-scene .found .object-check { display:block; }
      .arg-scene .found .mark-bg { fill:#778e7c; stroke:#b6c5ad; }
      .arg-scene .object-hit { fill:#fff; fill-opacity:0; pointer-events:all; }
      @media(prefers-reduced-motion:reduce){.arg-scene *{transition:none!important;}}
    </style>`;
  }

  function marker(x, y) {
    return `<g class="object-mark" transform="translate(${x} ${y})" opacity=".9" aria-hidden="true"><circle r="14" fill="#0c1721" opacity=".35"/><circle class="mark-bg" r="10" fill="#182935" stroke="#b3b49b" stroke-width="1.2"/><path class="object-plus" d="M-3.5 0h7M0-3.5v7" fill="none" stroke="#e8dfc4" stroke-width="1.3" stroke-linecap="round"/><path class="object-check" d="m-4 0 2.5 2.8 5-5.2" fill="none" stroke="#f5efda" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  }

  function object(id, label, hit, art, mark, collected) {
    const found = collected.has(id) ? ' found' : '';
    return `<g class="scene-object${found}" data-evidence="${id}" tabindex="0" role="button" aria-label="查看${label}${found ? '，已收录' : ''}"><title>${label}${found ? ' · 已收录' : ''}</title><rect class="object-hit" x="${hit[0]}" y="${hit[1]}" width="${hit[2]}" height="${hit[3]}" rx="8"/><g class="object-art">${art}</g>${marker(mark[0], mark[1])}</g>`;
  }

  function room(p, wall = '') {
    return `<path d="M0 0h1000v600H0z" fill="#101b25"/>
      <path d="M0 0h1000v405L0 442z" fill="url(#${p}-wall)"/>
      ${wall}
      <path d="M0 442 1000 405v195H0z" fill="url(#${p}-floor)"/>
      <path d="M0 442 1000 405v195H0z" fill="url(#${p}-floorlines)"/>
      <path d="M0 437 1000 400" stroke="#7c8a7f" stroke-opacity=".18" stroke-width="4"/>
      <ellipse cx="475" cy="510" rx="450" ry="160" fill="url(#${p}-light)"/>`;
  }

  function theatre(p, c) {
    const script = `<path d="m190 382 123-13 23 82-128 15z" fill="#090e19" opacity=".45" transform="translate(5 7)"/>
      <path d="m191 378 124-12 20 81-126 14z" fill="#adae9a"/>
      <path d="m188 373 124-10 20 80-128 14z" fill="url(#${p}-paper)"/>
      <path d="m199 388 43-4m-40 13 86-9m-82 21 76-8m-74 18 88-9m-85 20 48-5" stroke="#64716c" stroke-width="2" opacity=".6"/>
      <path d="m205 415 57-6m-53 18 68-7" stroke="#994d4b" stroke-width="2.1" opacity=".8"/>
      <path d="m291 365 21-2 5 21-12-5-10 7z" fill="#6d3e46"/>
      <path d="m181 385 7 2 17 55-7-1z" fill="#9a7461"/>`;
    const rig = `<path d="M706 46v89M777 46v89" stroke="#657879" stroke-width="4"/>
      <path d="M707 46v89M778 46v89" stroke="#b5b8a3" stroke-opacity=".2" stroke-width="1"/>
      <path d="M693 131h96l-8 48h-80z" fill="url(#${p}-metal)" stroke="#82948e" stroke-width="2"/>
      <circle cx="741" cy="154" r="21" fill="#172a35" stroke="#a0aba0" stroke-width="3"/>
      <circle cx="741" cy="154" r="8" fill="#738883"/>
      <path d="M741 177v35m0 0c-23 0-23 34 0 34 18 0 21-20 13-28" fill="none" stroke="#9da69b" stroke-width="8" stroke-linecap="round"/>
      <path d="M741 177v35m0 0c-23 0-23 34 0 34" fill="none" stroke="#d6d3b5" stroke-opacity=".35" stroke-width="2"/>
      <path d="m729 203 22 5m-22 4 18 4" stroke="#79624d" stroke-width="4"/>
      <path d="m738 246-30 88m38-88 45 95" stroke="#2a3e45" stroke-width="6"/>
      <path d="m739 247-30 88m38-88 45 95" stroke="#6e7e77" stroke-opacity=".45" stroke-width="1.5"/>`;
    const drawer = `<path d="m214 460 139-5 1 52-138 7z" fill="#17292e" stroke="#60706a" stroke-opacity=".5"/>
      <path d="m222 468 113-4 2 19-111 7z" fill="#121d25"/>
      <path d="m244 469 64-2 2 17-65 4z" fill="#9f9f8c"/>
      <path d="m250 474 45-1m-43 5 33-1" stroke="#626e67" stroke-width="1.5"/>
      <path d="m217 483 140-6 0 31-139 8z" fill="#46534e" stroke="#7a8475" stroke-opacity=".55"/>
      <path d="m268 491 40-2v7l-40 2z" fill="#152a30"/>
      <path d="m276 492 23-1" stroke="#a1a28b" stroke-width="2"/>`;
    return room(p) + `
      <path d="M0 0h1000v48H0z" fill="#0a121d"/>
      <path d="M65 14h866v19H65z" fill="#303d43"/>
      <path d="M63 28h867" stroke="#7d8980" stroke-opacity=".25"/>
      <path d="M0 0h125c0 99-22 161-51 206L47 444 0 452z" fill="url(#${p}-curtain)"/>
      <path d="M18 14c20 157 15 225 2 412M51 3c24 114 11 246-6 424M88 4c15 89-4 168-28 215" stroke="#a06061" stroke-opacity=".16" stroke-width="3" fill="none"/>
      <path d="M902 0h98v431l-36-6-18-213c-30-56-44-121-44-212z" fill="url(#${p}-curtain)"/>
      <path d="M936 4c-2 127 16 155 28 207l14 203M969 4c-7 160 8 247 14 400" stroke="#a06061" stroke-opacity=".14" stroke-width="3" fill="none"/>
      <path d="m149 56 75-15 488 475-549 28z" fill="#ddc08d" opacity=".045"/>
      <g opacity=".7"><path d="M491 108h125v205H491z" fill="#15242d" stroke="#5a6d6a"/><path d="m503 120 101 0v180H503z" fill="#273738"/><path d="M516 141h76M516 154h51M516 177h67M516 190h39" stroke="#93a18c" stroke-width="3" opacity=".25"/><path d="m509 252 22-26 22 14 22-19 22 34" fill="none" stroke="#a5a18b" stroke-opacity=".15" stroke-width="2"/></g>
      <path d="M646 62h181v12H646z" fill="#1c2d36" stroke="#5b6e6c" stroke-opacity=".35"/>
      <path d="m661 73-7 298m158-298 15 294" stroke="#566d6c" stroke-width="4"/>
      <g opacity=".68"><path d="m841 315 51-4 26 55-68 6z" fill="#33484a"/><path d="m851 372 68-6v72l-68 7z" fill="#24393e"/><path d="M858 395h54m-54 11h54" stroke="#758279" stroke-opacity=".25"/></g>
      <ellipse cx="356" cy="529" rx="269" ry="39" fill="#060e1a" opacity=".4"/>
      <path d="m104 392 390-37 61 64-405 45z" fill="url(#${p}-wood)" stroke="#857565" stroke-opacity=".3"/>
      <path d="m150 464 405-45v17l-405 47z" fill="#303c3d"/>
      <path d="m104 392 46 72v19l-46-70z" fill="#384442"/>
      <path d="m154 478 26-2-8 103-20 1zM507 439l22-3 7 111-18 3z" fill="#243439"/>
      <path d="m354 389 86-8 19 29-90 9z" fill="#26363a"/><path d="m364 394 58-6m-55 11 49-5" stroke="#a1a28b" stroke-opacity=".3" stroke-width="2"/>
      <path d="m400 359 34-4 8 26-33 4z" fill="#384b49"/><path d="m407 362 21-2" stroke="#b6af8c" stroke-opacity=".4"/>
      <g opacity=".65"><path d="m615 422 104-9 37 36-108 12z" fill="#6a5c4b"/><path d="m648 461 108-12v86l-108 15z" fill="#3f4540"/><path d="m615 422 33 39v89l-33-42z" fill="#343f3e"/><path d="m659 479 83-10m-83 39 83-10" stroke="#94816a" stroke-opacity=".3" stroke-width="4"/><path d="m686 455 12-1v90l-12 2z" fill="#23383d"/></g>
      ${object('theatre-script', '桌上的剧本', [170, 355, 175, 112], script, [313, 423], c)}
      ${object('theatre-rig', '威亚连接部位', [686, 118, 113, 150], rig, [780, 205], c)}
      ${object('debate-draft', '半开的文件抽屉', [207, 451, 153, 78], drawer, [341, 494], c)}`;
  }

  function bio(p, c) {
    const emptyBag = `<path d="m451 368 119 8-11 73-115-13z" fill="#07090c" opacity=".4" transform="translate(5 6)"/>
      <path d="m451 362 119 9-12 73-114-13z" fill="#bec5cd" fill-opacity=".16" stroke="#a8b1bd" stroke-opacity=".62" stroke-width="1.6"/>
      <path d="m451 362 119 9-2 9-118-10z" fill="#b7c1cd" fill-opacity=".2"/>
      <path d="m453 368 113 9m-113-5 112 9" fill="none" stroke="#bfc8d3" stroke-opacity=".7" stroke-width="1.1"/>
      <path d="m448 379 11 43 87 11m-86-52 26 42m-18-48 73 59m-31-52 33 52m12-51-12 43" fill="none" stroke="#d6dce5" stroke-opacity=".17" stroke-width="1.2"/>
      <path d="m482 385 61 6-3 23-61-7z" fill="#c5cbd3" fill-opacity=".62" stroke="#e1e6ed" stroke-opacity=".32"/>
      <path d="m454 411 20 2-1 5-4-1-3 4-4-2-3 3-6-1z" fill="#d1d5dc" fill-opacity=".78"/>
      <path d="m454 424 19 2-2 15-3-2-4 2-3-3-3 2-6-3z" fill="#cbd0d8" stroke="#e6e9ef" stroke-opacity=".32"/>
      <path d="m456 417 17 2" stroke="#747d8a" stroke-width="1.4" stroke-dasharray="1.7 2"/>
      <path d="m450 429 106 12" stroke="#e7ebf0" stroke-opacity=".16" stroke-width="1.5"/>`;
    const wrapper = `<ellipse cx="786" cy="338" rx="49" ry="8" fill="#07090c" opacity=".44"/>
      <path d="m745 221 17-6 12 4 15-6 15 6 17-2 5 96-12 16-19-4-14 7-16-8-22 3-5-35z" fill="#8d969f" stroke="#c2cad3" stroke-opacity=".54" stroke-width="1.5"/>
      <path d="m746 221 11 7 10-7 11 9 13-10 12 6 9-7 9-2-3 18-17 6-12-7-11 7-12-4-21 9z" fill="#b7bec7" fill-opacity=".55"/>
      <path d="m747 242 21 18-13 26 24 14-14 24m23-89-14 34 29 20-18 37m28-91-13 31 19 20-7 29M747 293l22-8 21 15 31-12" fill="none" stroke="#59636f" stroke-width="2.1" stroke-opacity=".7"/>
      <path d="m750 247 18 10-12 23m34-43-11 30 28 22m-32 15 13 20m-39-30 18-5" fill="none" stroke="#e1e5eb" stroke-opacity=".36" stroke-width="1.2"/>
      <path d="m756 263 43-5 3 24-44 7z" fill="#cbd0d7" fill-opacity=".76" stroke="#e4e8ed" stroke-opacity=".34"/>
      <path d="m807 282 24-4 2 6 4 3-2 8 3 7-4 8 2 9-4 15-25-2 2-10-3-9 3-8-3-10z" fill="#d1d6dd" stroke="#e2e6ec" stroke-opacity=".4"/>
      <path d="m808 285 23-4m-23 43 24 3" stroke="#929ba6" stroke-width="1.2"/>
      <path d="m812 289-1 31" stroke="#9aa3ae" stroke-width="1.1" stroke-dasharray="2 3"/>`;
    return room(p, `<path d="M0 0h1000v405L0 442z" fill="#31433d" opacity=".55"/>`) + `
      <path d="M99 69h333v213H99z" fill="#11232d" stroke="#5b7167" stroke-width="8"/>
      <path d="M112 81h307v188H112z" fill="url(#${p}-glass)"/>
      <path d="M211 81v188M319 81v188M112 175h307" stroke="#718278" stroke-width="5"/>
      <path d="m112 83 154 0-154 157zM225 83h111L149 269h-37v-65z" fill="#b5c5af" opacity=".06"/>
      <path d="M625 97h256v17H625zM625 347h256v18H625zM631 112v322M873 112v322" fill="#1c3237" stroke="#6b7f71" stroke-opacity=".35" stroke-width="3"/>
      <path d="M627 207h253v11H627z" fill="#3a514a"/>
      <path d="M644 139h54v63h-54z" fill="#6a7662"/><path d="M654 155h35v25h-35z" fill="#b4b396"/><path d="M661 163h21m-21 7h15" stroke="#6d7d6b" stroke-width="2"/>
      <path d="M719 149h38v53h-38z" fill="#445e55"/><path d="M726 144h24v9h-24z" fill="#8e987e"/>
      <path d="M785 130h66v72h-66z" fill="#425c55"/><path d="M796 151h42v29h-42z" fill="#a5ad8c"/><path d="M802 162h29" stroke="#647b67" stroke-width="2"/>
      <path d="M648 253h57v88h-57z" fill="#3e5a52"/><ellipse cx="677" cy="253" rx="29" ry="7" fill="#75856d"/><path d="M657 245h39v10h-39z" fill="#263c40"/><path d="M656 275h40v31h-40z" fill="#a2ad8c" opacity=".8"/>
      <path d="m136 361 450-23 57 108-466 37z" fill="url(#${p}-desk)" stroke="#8b9981" stroke-opacity=".3"/>
      <path d="m177 483 466-37v17l-466 39z" fill="#20373b"/>
      <path d="m136 361 41 122v19l-41-124z" fill="#283d3d"/>
      <path d="m187 501 22-2-7 83h-19zM585 469l22-2 10 90-19 1z" fill="#24383d"/>
      <path d="m230 377 119-9 31 65-120 11z" fill="#a9b194"/><path d="m240 386 47-3 25 50-46 4z" fill="#c9ccb0"/><path d="m291 383 49-4 25 51-49 4z" fill="#b8bfa3"/><path d="m286 381 28 53" stroke="#6c8070" stroke-width="2"/><path d="m250 398 30-2m-25 11 30-2m-25 11 28-2m22-20 28-2m-24 11 28-2m-24 11 28-2" stroke="#71836f" stroke-width="1.6" opacity=".7"/>
      <path d="m396 313 15-1 15 83-45 4z" fill="#9ca98b" opacity=".8"/><path d="m396 311 15-1-2-12-15 1z" fill="#456358"/><path d="m393 355 24-2 5 25-34 3z" fill="#5f816e"/>
      <path d="M518 347v-99l-47-61" fill="none" stroke="#6b8073" stroke-width="8" stroke-linecap="round"/><path d="m455 167 35 2 13 33-68 6z" fill="#73856f"/><path d="m435 208 68-6" stroke="#c5c3a2" stroke-width="4"/><path d="m450 208-57 171 177-12-72-162z" fill="#e4d8ac" opacity=".04"/>
      <path d="m495 347 43-1 16 13-62 3z" fill="#344e45"/>
      <g opacity=".75"><path d="M54 373c-15-59 8-89 22-108 0 48 12 78-5 111M71 374c4-78 29-108 47-112-7 53-22 90-47 112M69 375c-22-40-43-53-58-49 13 28 36 45 58 49" fill="#536b50"/><path d="m45 371 51-2-9 57-31 1z" fill="#665b4a"/></g>
      ${object('bio-handoff', '空的周转袋', [443, 350, 132, 105], emptyBag, [551, 419], c)}
      ${object('bio-label', '破损外包装', [729, 199, 110, 152], wrapper, [820, 297], c)}`;
  }

  function psych(p, c) {
    const computer = `<path d="m258 212 220-4 0 167-220 5z" fill="#111f2a" stroke="#73877c" stroke-width="3"/>
      <path d="m269 224 197-4v140l-197 4z" fill="url(#${p}-screen)"/>
      <path d="m278 234 179-3v15l-179 4z" fill="#506f69" opacity=".7"/>
      <circle cx="286" cy="242" r="2" fill="#c4cfb4"/><circle cx="294" cy="242" r="2" fill="#c4cfb4" opacity=".6"/>
      <path d="m306 258 126-2v88l-126 3z" fill="#e0dfc8"/>
      <path d="m318 272 76-1m-76 11 102-2m-102 12 92-1m-92 11 101-1m-101 12 67-1" stroke="#7e9586" stroke-width="2"/>
      <path d="m318 325 100-1" stroke="#a77965" stroke-width="3"/>
      <path d="m350 378 34-1 4 33 30 5v8l-96 2v-8l27-7z" fill="#60776f"/>
      <path d="M362 371h11" stroke="#9aaa92" stroke-width="2"/>
      <path d="m282 432 184-6 29 24-188 8z" fill="#788a7c"/><path d="m294 435 159-5m-151 11 159-5m-151 11 159-5" stroke="#3b5754" stroke-width="3" stroke-dasharray="7 3"/>`;
    const phone = `<g transform="rotate(14 700 448)"><rect x="669" y="400" width="65" height="105" rx="10" fill="#101f2c" stroke="#879b8e" stroke-width="2"/><rect x="675" y="411" width="53" height="80" rx="3" fill="#9bb5a4"/><path d="M690 405h23" stroke="#728c7c" stroke-width="2" stroke-linecap="round"/><path d="M680 420h37v13h-37zM692 439h30v12h-30zM680 457h34v17h-34z" fill="#d3d8bf"/><path d="M684 426h25m-13 19h20m-32 17h23m-23 6h15" stroke="#668c7c" stroke-width="1.5"/><circle cx="701" cy="497" r="2.8" fill="#80998a"/></g>`;
    return room(p, `<path d="M0 0h1000v405L0 442z" fill="#42514a" opacity=".35"/>`) + `
      <path d="M79 92h103v225H79z" fill="#1a2d34" stroke="#64786e" stroke-width="4"/><path d="M88 103h84v202H88z" fill="#4f6b63" opacity=".5"/><path d="M99 122h61v161H99z" fill="#859680" opacity=".22"/>
      <path d="M563 92h292v224H563z" fill="#172b31" stroke="#5e766a" stroke-width="6"/><path d="M574 103h270v202H574z" fill="#6f7160"/>
      <path d="m597 124 90-4 7 69-90 5z" fill="#c5c4a3"/><path d="m614 143 55-3m-54 12 48-2m-47 12 54-3" stroke="#7d8b72" stroke-width="2"/><circle cx="644" cy="126" r="3" fill="#7c4f4b"/>
      <path d="m722 133 94 7-5 106-94-7z" fill="#a2b39a"/><path d="m737 152 60 4m-61 12 59 5m-60 13 43 3m-44 14 60 4m-61 13 50 4" stroke="#637f6c" stroke-width="2"/><circle cx="768" cy="143" r="3" fill="#b8b18f"/>
      <path d="m604 219 80-7 5 65-79 7z" fill="#b7b89a"/><path d="m619 236 49-4m-48 14 40-3m-39 14 48-4" stroke="#788a73" stroke-width="2"/><circle cx="642" cy="221" r="3" fill="#4e6f63"/>
      <path d="M888 127v266" stroke="#718879" stroke-width="6"/><path d="M872 128h32l17 56h-67z" fill="#b8b89a"/><ellipse cx="888" cy="184" rx="33" ry="6" fill="#d0c5a1" opacity=".55"/><path d="m866 189-50 227h143l-56-227z" fill="#e3d4aa" opacity=".035"/>
      <path d="M864 397h48v8h-48z" fill="#334c44"/>
      <path d="M151 335c0-47 28-68 65-67 43 1 65 26 65 66l-4 105-126 6z" fill="#2a4140" stroke="#61796a" stroke-opacity=".5" stroke-width="2"/><path d="M164 335c0-36 18-52 49-52 35 0 53 17 53 53" fill="none" stroke="#83917a" stroke-opacity=".2" stroke-width="2"/>
      <ellipse cx="526" cy="548" rx="358" ry="40" fill="#060e1b" opacity=".3"/>
      <path d="m201 411 585-18 65 101-606 36z" fill="url(#${p}-desk)" stroke="#9aa38b" stroke-opacity=".3"/>
      <path d="m245 530 606-36v16l-606 36z" fill="#24393d"/>
      <path d="m201 411 44 119v16l-44-119z" fill="#273c3d"/>
      <path d="m256 546 22-1-6 48h-21zM788 514l24-1 6 70-20 1z" fill="#21373c"/>
      <path d="m516 433 94-4 24 49-95 5z" fill="#aeb69a"/><path d="m531 445 62-3m-57 13 61-3m-56 13 45-2" stroke="#657f6c" stroke-width="2"/>
      <path d="m742 393 35-1 5 34-35 1z" fill="#9eac8e"/><ellipse cx="760" cy="393" rx="18" ry="6" fill="#c2c7a7"/><ellipse cx="760" cy="394" rx="13" ry="3.5" fill="#445b50"/><path d="M779 400c20-2 23 19 3 20" fill="none" stroke="#a3ae90" stroke-width="5"/>
      ${object('psych-draft', '电脑上的通知草稿', [250, 202, 237, 192], computer, [450, 344], c)}
      ${object('psych-chat', '桌上的联络手机', [652, 390, 100, 130], phone, [738, 478], c)}`;
  }

  function martial(p, c) {
    const photo = `<g transform="rotate(-8 270 220)"><path d="M226 171h88v106h-88z" fill="#0d1a25" opacity=".35" transform="translate(5 5)"/><path d="M224 168h88v106h-88z" fill="#d0ceb3"/><path d="M231 177h74v77h-74z" fill="#35494c"/><path d="M234 179h10v74h-10zM291 179h11v74h-11z" fill="#714b4b"/><path d="M244 219h47v34h-47z" fill="#56675e"/><path d="M244 219h47m-24-36v36" stroke="#9da58c" stroke-width="2" opacity=".55"/><path d="m249 238 12-8 14 7 9-17" fill="none" stroke="#bbc1a7" stroke-width="3" opacity=".65"/><path d="M236 263h51" stroke="#84947c" stroke-width="2"/><path d="M254 168v-7h28v7" fill="#8a9b84" opacity=".8"/></g>`;
    const camera = `<ellipse cx="735" cy="548" rx="101" ry="13" fill="#040e1b" opacity=".4"/>
      <path d="m729 372-49 174m51-174 62 171m-62-171 0 176" fill="none" stroke="#627b76" stroke-width="7" stroke-linecap="round"/>
      <path d="m713 430 38-1m-59 66h80" stroke="#354d50" stroke-width="4"/>
      <path d="M704 360h55v17h-55z" fill="#a0aa94"/><path d="M725 350h13v23h-13z" fill="#435d5b"/>
      <path d="M676 295h95v63h-95z" fill="#263d44" stroke="#81948b" stroke-width="2"/><path d="M691 281h42v16h-42z" fill="#536b64"/>
      <path d="M771 307h26v39h-26z" fill="#576d67"/><ellipse cx="797" cy="326" rx="12" ry="21" fill="#182c37" stroke="#9ba899" stroke-width="2"/><ellipse cx="798" cy="326" rx="7" ry="14" fill="#0b202f"/><path d="M682 308h48v35h-48z" fill="#90aa99"/><path d="m688 336 13-12 9 6 12-16v22z" fill="#425f5b"/><circle cx="742" cy="308" r="4" fill="#ad8b72"/><path d="M741 320h17m-17 7h17m-17 7h17" stroke="#90a294" stroke-width="2"/><path d="M663 304h13v35h-13z" fill="#162e3a"/><path d="M675 351h83" stroke="#9da68e" stroke-opacity=".3"/>
      <path d="M760 360h24l16 23" fill="none" stroke="#617b72" stroke-width="5" stroke-linecap="round"/>`;
    return room(p, `<path d="M0 0h1000v405L0 442z" fill="#4b5249" opacity=".3"/>`) + `
      <path d="M106 76h432v332l-432 14z" fill="#13262f" stroke="#64786c" stroke-width="8"/>
      <path d="M118 88h408v306l-408 14z" fill="url(#${p}-glass)"/>
      <path d="M324 88v313" stroke="#799087" stroke-opacity=".45" stroke-width="3"/>
      <path d="m119 90 187-1-187 247zM399 88h94L256 402l-73 3z" fill="#b3c5ae" opacity=".06"/>
      <path d="m151 259 338-5" stroke="#8b9983" stroke-opacity=".22" stroke-width="8"/>
      <path d="m155 271 337-5" stroke="#223b41" stroke-opacity=".55" stroke-width="7"/>
      <path d="m175 406 290-10 60 100-293 23z" fill="#8f9e80" opacity=".07"/>
      <path d="M69 276 557 268" stroke="#152c36" stroke-width="12" stroke-linecap="round"/><path d="M69 273 557 265" stroke="#a09575" stroke-width="7" stroke-linecap="round"/>
      <path d="M88 276v111M540 268v99" stroke="#6c7b6d" stroke-width="5"/>
      <path d="M609 110h245v100H609z" fill="#1b3037" stroke="#5c7467" stroke-width="3"/><path d="M622 121h219v77H622z" fill="#65735f" opacity=".7"/>
      <path d="M640 142h143m-143 16h172m-172 16h115" stroke="#aab094" stroke-width="3" opacity=".4"/>
      <path d="M884 210h48v208h-48z" fill="#283e41"/><path d="M879 209h58" stroke="#718574" stroke-width="5"/>
      <path d="m885 234-24 37 12 69 14-6 6 42h29l7-43 14 5 10-68-25-36-19 12z" fill="#4d6459" stroke="#81917b" stroke-opacity=".35"/>
      <path d="m892 238 17 28 18-28m-18 28v104" stroke="#a3ad8f" stroke-opacity=".3" stroke-width="2"/>
      <path d="m119 459 454-21 134 118-464 39z" fill="#53665b" stroke="#8d9a7e" stroke-opacity=".3"/>
      <path d="m119 459 124 136v5h-22L109 474z" fill="#304b46"/>
      <path d="m230 454 126 132m-13-138 127 130m-14-135 128 125m-418-75 458-27m-420 68 458-33" stroke="#a3ac8d" stroke-opacity=".14" stroke-width="2"/>
      <path d="m62 483 57-6 28 28-59 8z" fill="#5d6e5c"/><path d="m69 495 57-5" stroke="#bdbaa0" stroke-opacity=".3" stroke-width="2"/>
      <path d="m824 456 79-5 37 35-81 8z" fill="#6b6b55"/><path d="m859 494 81-8v51l-81 10z" fill="#3b5048"/><path d="m824 456 35 38v53l-35-39z" fill="#2d4543"/><path d="m873 499 52-6m-52 16 52-6" stroke="#95a080" stroke-opacity=".3" stroke-width="3"/>
      ${object('martial-photo', '镜边的后台工作照', [211, 151, 118, 136], photo, [307, 253], c)}
      ${object('martial-video', '三脚架上的录像设备', [651, 273, 164, 116], camera, [780, 350], c)}`;
  }

  const renderers = { theatre, bio, psych, martial };
  window.ARGScenes = {
    hotspots: Object.fromEntries(Object.entries(locations).map(([key, value]) => [key, value.hotspots])),
    render(locationId, collectedIds = []) {
      const location = locations[locationId];
      if (!location) return '';
      const p = `arg-${locationId}`;
      const c = new Set(collectedIds);
      return `<svg xmlns="http://www.w3.org/2000/svg" class="arg-scene scene-${locationId}" viewBox="0 0 1000 600" role="img" aria-labelledby="${p}-title ${p}-desc"><title id="${p}-title">${location.name}</title><desc id="${p}-desc">可探索的调查现场。选择物品查看细节，带加号的标记表示可调查，勾号表示证据已经收录。</desc>${definitions(p)}${renderers[locationId](p, c)}<path d="M0 0h1000v600H0z" fill="url(#${p}-grain)" pointer-events="none"/><path d="M0 0h1000v600H0z" fill="url(#${p}-vignette)" pointer-events="none"/></svg>`;
    }
  };
})();
