/* ============================================================
   CONFIGURAÇÃO DO MOCHO — PREÇOS E OPÇÕES FIXOS NO CÓDIGO
   ============================================================ */
const CONFIG = {
  empresa: 'duoequilibrium',
  slogan: 'Móveis com equilíbrio entre forma e função',
  tamanhos: [
    { id: 'P',  nome: 'P · 45cm', preco: 89.90 },
    { id: 'M',  nome: 'M · 60cm', preco: 109.90 },
    { id: 'G',  nome: 'G · 75cm', preco: 129.90 },
    { id: 'GG', nome: 'GG · 90cm', preco: 149.90 }
  ],
  backs: [
    { id: 'sem',   nome: 'Sem back', preco: 0 },
    { id: 'fixo',  nome: 'Back fixo', preco: 30 },
    { id: 'reclin', nome: 'Back reclinável', preco: 45 },
    { id: 'alto',  nome: 'Back alto', preco: 55 }
  ],
  materiais: [
    { id: 'madeira', nome: 'Madeira maciça', preco: 0 },
    { id: 'couro',   nome: 'Couro sintético', preco: 20 },
    { id: 'tecido',  nome: 'Tecido premium', preco: 15 },
    { id: 'estofado', nome: 'Estofado completo', preco: 35 }
  ],
  bases: [
    { id: 'madeira', nome: 'Base de madeira', preco: 0 },
    { id: 'metal',   nome: 'Base metálica', preco: 25 },
    { id: 'inox',    nome: 'Base de inox', preco: 45 },
    { id: 'giro',    nome: 'Giro 360°', preco: 35 }
  ],
  acessorios: [
    { id: 'rodizios',    nome: 'Rodízios', preco: 25 },
    { id: 'apoio-pes',   nome: 'Apoio para pés', preco: 15 },
    { id: 'espuma',      nome: 'Espuma extra densa', preco: 20 },
    { id: 'revest-lava', nome: 'Revestimento lavável', preco: 18 },
    { id: 'porta-revista', nome: 'Suporte porta-revista', preco: 22 },
    { id: 'gancho',      nome: 'Gancho para bolsa', preco: 12 },
    { id: 'tapete-antiderrapante', nome: 'Tapete antiderrapante', preco: 10 },
    { id: 'personalizacao', nome: 'Gravação personalizada', preco: 30 }
  ],
  coresAssento: ['Marrom', 'Preto', 'Caramelo', 'Verde Musgo', 'Azul Marinho', 'Creme', 'Vermelho', 'Grafite'],
  coresEstrutura: ['Madeira Natural', 'Preto', 'Branco', 'Cromado', 'Dourado', 'Carvalho']
};

let itens = [];
let itemCounter = 0;

/* ============================================================
   INTERFACE DE CONFIGURAÇÃO
   ============================================================ */
function buildRadio(parentId, list, name) {
  const parent = document.getElementById(parentId);
  parent.innerHTML = '';
  list.forEach((opt, i) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = name;
    input.value = opt.id;
    if (i === 0) input.checked = true;
    const span = document.createElement('span');
    span.textContent = opt.nome;
    label.appendChild(input);
    label.appendChild(span);
    if (opt.preco) {
      const preco = document.createElement('span');
      preco.className = 'preco';
      preco.textContent = `+R$${opt.preco.toFixed(2)}`;
      label.appendChild(preco);
    }
    parent.appendChild(label);
  });
}

function buildChecks(parentId, name) {
  const parent = document.getElementById(parentId);
  parent.innerHTML = '';
  CONFIG.acessorios.forEach((opt) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = name;
    input.value = opt.id;
    const span = document.createElement('span');
    span.textContent = opt.nome;
    label.appendChild(input);
    label.appendChild(span);
    const preco = document.createElement('span');
    preco.className = 'preco';
    preco.textContent = `+R$${opt.preco.toFixed(2)}`;
    label.appendChild(preco);
    parent.appendChild(label);
  });
}

function buildSelect(id, list) {
  const el = document.getElementById(id);
  el.innerHTML = '';
  list.forEach((c) => {
    const option = document.createElement('option');
    option.value = c;
    option.textContent = c;
    el.appendChild(option);
  });
}

function getSelected(parentId) {
  const input = document.querySelector(`#${parentId} input:checked`);
  return input ? input.value : null;
}

function getCheckedAcessorios() {
  return [...document.querySelectorAll('#acessoriosGroup input:checked')].map(i => i.value);
}

function precoOpt(id, list) {
  const item = list.find(o => o.id === id);
  return item ? item.preco : 0;
}

function nomeOpt(id, list) {
  const item = list.find(o => o.id === id);
  return item ? item.nome : id;
}

const CAMPOS_FABRICACAO = ['espessura', 'pistao', 'mSela', 'linhaSoft', 'corAssento', 'corEstrutura'];

function especificacoesConfiguradas() {
  const valor = id => document.getElementById(id)?.value || '';
  return {
    espuma: valor('espessura') || 'Não informado',
    pistao: valor('pistao') || 'Não informado',
    sela: 'Sim',
    tamanhoSela: valor('linhaSoft') || 'Padrão',
    corAssento: valor('corAssento') || 'Preto',
    corEstrutura: valor('corEstrutura') || 'Cromado'
  };
}

/* ============================================================
   VISUALIZADOR 3D DO MOCHO
   ============================================================ */
let mocho3D;

function iniciarMocho3D() {
  const host = document.getElementById('mochoViewer');
  if (!host || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(5.7, 4.2, 7.2);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);

  const model = new THREE.Group();
  model.rotation.y = -0.55;
  scene.add(model);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x7b88a2, 2.2));
  const key = new THREE.DirectionalLight(0xffffff, 2.8);
  key.position.set(4, 7, 5); scene.add(key);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(3.7, 64), new THREE.MeshBasicMaterial({ color: 0xaebad0, transparent: true, opacity: .34 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -2.07; scene.add(ground);

  const seat = new THREE.Mesh(new THREE.CylinderGeometry(1.48, 1.58, .34, 48), new THREE.MeshStandardMaterial({ roughness: .62, metalness: .03 }));
  seat.position.y = 1.25; model.add(seat);
  const seatEdge = new THREE.Mesh(new THREE.TorusGeometry(1.5, .07, 12, 48), new THREE.MeshStandardMaterial({ color: 0x1b2230, roughness: .48 }));
  seatEdge.rotation.x = Math.PI / 2; seatEdge.position.y = 1.1; model.add(seatEdge);
  const column = new THREE.Mesh(new THREE.CylinderGeometry(.18, .23, 2.25, 24), new THREE.MeshStandardMaterial({ metalness: .75, roughness: .24 }));
  column.position.y = -.05; model.add(column);
  const back = new THREE.Group(); model.add(back);
  const base = new THREE.Group(); model.add(base);
  const extras = new THREE.Group(); model.add(extras);
  mocho3D = { scene, camera, renderer, model, seat, seatEdge, column, back, base, extras, zoom: 1, yaw: -.55, pitch: 0 };

  let dragging = false, startX = 0, startY = 0;
  host.addEventListener('pointerdown', e => { dragging = true; startX = e.clientX; startY = e.clientY; host.setPointerCapture(e.pointerId); });
  host.addEventListener('pointermove', e => {
    if (!dragging) return;
    mocho3D.yaw += (e.clientX - startX) * .012;
    mocho3D.pitch = Math.max(-.35, Math.min(.3, mocho3D.pitch + (e.clientY - startY) * .008));
    startX = e.clientX; startY = e.clientY;
  });
  host.addEventListener('pointerup', () => dragging = false);
  host.addEventListener('wheel', e => { e.preventDefault(); mocho3D.zoom = Math.max(.8, Math.min(1.35, mocho3D.zoom - e.deltaY * .001)); }, { passive: false });
  new ResizeObserver(() => renderMocho3D()).observe(host);
  configurarJanelaViewer();

  function animate() {
    requestAnimationFrame(animate);
    if (!dragging) mocho3D.yaw += .0018;
    renderMocho3D();
  }
  animate();
  atualizarMocho3D();
}

function configurarJanelaViewer() {
  const popup = document.getElementById('mochoViewerPopup');
  const handle = document.getElementById('viewerDragHandle');
  const abrir = document.getElementById('btnViewerToggle');
  const fechar = document.getElementById('btnViewerClose');
  const tamanho = document.getElementById('viewerSize');
  const tamanhoValor = document.getElementById('viewerSizeValue');
  const menor = document.getElementById('btnViewerSmaller');
  const maior = document.getElementById('btnViewerLarger');
  const redefinir = document.getElementById('btnViewerReset');
  let movendo = false, offsetX = 0, offsetY = 0;

  abrir.addEventListener('click', () => { popup.classList.remove('hidden'); popup.setAttribute('aria-hidden', 'false'); renderMocho3D(); });
  fechar.addEventListener('click', () => { popup.classList.add('hidden'); popup.setAttribute('aria-hidden', 'true'); });
  const aplicarTamanho = valor => {
    const largura = Math.max(320, Math.min(700, Number(valor)));
    popup.style.width = `${largura}px`;
    popup.style.height = `${Math.round(largura * .95)}px`;
    tamanho.value = largura;
    tamanhoValor.textContent = `${largura} px`;
    renderMocho3D();
  };
  tamanho.addEventListener('input', event => aplicarTamanho(event.target.value));
  menor.addEventListener('click', () => aplicarTamanho(Number(tamanho.value) - 20));
  maior.addEventListener('click', () => aplicarTamanho(Number(tamanho.value) + 20));
  redefinir.addEventListener('click', () => {
    popup.style.left = ''; popup.style.top = ''; popup.style.right = '28px';
    aplicarTamanho(430);
  });
  new ResizeObserver(() => {
    const largura = Math.round(popup.getBoundingClientRect().width);
    tamanho.value = Math.max(320, Math.min(700, largura));
    tamanhoValor.textContent = `${largura} px`;
    renderMocho3D();
  }).observe(popup);
  handle.addEventListener('pointerdown', event => {
    if (event.target.closest('button')) return;
    const rect = popup.getBoundingClientRect();
    movendo = true; offsetX = event.clientX - rect.left; offsetY = event.clientY - rect.top;
    popup.style.left = `${rect.left}px`; popup.style.top = `${rect.top}px`; popup.style.right = 'auto';
    handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener('pointermove', event => {
    if (!movendo) return;
    popup.style.left = `${Math.max(0, Math.min(window.innerWidth - 120, event.clientX - offsetX))}px`;
    popup.style.top = `${Math.max(0, Math.min(window.innerHeight - 70, event.clientY - offsetY))}px`;
  });
  handle.addEventListener('pointerup', () => movendo = false);
  handle.addEventListener('pointercancel', () => movendo = false);
}

function mesh(geometry, material, group, position, rotation) {
  const part = new THREE.Mesh(geometry, material);
  part.position.set(...position);
  if (rotation) part.rotation.set(...rotation);
  group.add(part); return part;
}

function limparGrupo3D(group) {
  while (group.children.length) {
    const part = group.children.pop();
    part.geometry?.dispose();
    if (Array.isArray(part.material)) part.material.forEach(m => m.dispose()); else part.material?.dispose();
  }
}

function cor3D(nome, fallback) {
  return ({ 'Marrom': 0x633b25, 'Preto': 0x17191f, 'Caramelo': 0xb96f3c, 'Verde Musgo': 0x445e43, 'Azul Marinho': 0x162b52, 'Creme': 0xe2d1b1, 'Vermelho': 0x9f3030, 'Grafite': 0x41454f, 'Madeira Natural': 0xa96b3e, 'Branco': 0xe8ebef, 'Cromado': 0xbcc5cf, 'Dourado': 0xa98232, 'Carvalho': 0x7c542f })[nome] || fallback;
}

function atualizarMocho3DLegadoDesativado() {
  if (!mocho3D) return;
  const material = getSelected('materialGroup');
  const baseTipo = getSelected('baseGroup');
  const backTipo = getSelected('backGroup');
  const tamanho = getSelected('tamanhoGroup');
  const anguloBack = Number(document.getElementById('backAngle').value);
  const alturaBase = Number(document.getElementById('baseHeight').value);
  const acessorios = getCheckedAcessorios();
  const corAssento = document.getElementById('corAssento').value;
  const corEstrutura = document.getElementById('corEstrutura').value;
  const temRodizios = document.getElementById('opcao-rodinhas').value === '1' || acessorios.includes('rodizios');
  const temLombar = document.getElementById('opcao-lombar').value === '1';
  const escala = ({ P: .83, M: .95, G: 1.06, GG: 1.16 })[tamanho] || 1;
  const elevacao = (alturaBase - 60) / 30 * .8;
  mocho3D.seat.scale.set(escala, 1, escala);
  mocho3D.seatEdge.scale.set(escala, 1, escala);
  mocho3D.seat.position.y = 1.25 + elevacao;
  mocho3D.seatEdge.position.y = 1.1 + elevacao;
  mocho3D.column.scale.y = (2.25 + elevacao) / 2.25;
  mocho3D.column.position.y = -.05 + elevacao / 2;
  const acabamento = { madeira: { roughness: .78, metalness: 0 }, couro: { roughness: .32, metalness: 0 }, tecido: { roughness: .93, metalness: 0 }, estofado: { roughness: .58, metalness: .02 } }[material];
  mocho3D.seat.material.color.setHex(cor3D(corAssento, 0x633b25));
  Object.assign(mocho3D.seat.material, acabamento);
  mocho3D.seatEdge.material.color.setHex(cor3D(corAssento, 0x20242e));
  const estrutMat = new THREE.MeshStandardMaterial({ color: cor3D(corEstrutura, 0x9ea9b8), metalness: ['metal', 'inox', 'giro'].includes(baseTipo) ? .85 : .18, roughness: baseTipo === 'madeira' ? .66 : .25 });
  mocho3D.column.material = estrutMat;

  limparGrupo3D(mocho3D.back); limparGrupo3D(mocho3D.base); limparGrupo3D(mocho3D.extras);
  if (backTipo !== 'sem') {
    const altura = backTipo === 'alto' ? 2.05 : backTipo === 'reclin' ? 1.5 : 1.25;
    mocho3D.back.position.set(0, 1.18 + elevacao, .8);
    mocho3D.back.rotation.x = -THREE.MathUtils.degToRad(anguloBack);
    const encosto = mesh(new THREE.BoxGeometry(2.15 * escala, altura, .28), mocho3D.seat.material.clone(), mocho3D.back, [0, .62 + altura / 2, .12]);
    encosto.material.color.setHex(cor3D(corAssento, 0x633b25));
    mesh(new THREE.CylinderGeometry(.09, .09, 1.15, 12), estrutMat, mocho3D.back, [0, .57, -.02]);
  } else {
    mocho3D.back.position.set(0, 0, 0);
    mocho3D.back.rotation.set(0, 0, 0);
  }
  if (baseTipo === 'giro') {
    mesh(new THREE.CylinderGeometry(1.18, 1.18, .15, 40), estrutMat, mocho3D.base, [0, -1.34, 0]);
  } else {
    const raio = baseTipo === 'madeira' ? 1.2 : 1.48;
    for (let i = 0; i < 5; i++) {
      const a = i * Math.PI * 2 / 5;
      const haste = mesh(new THREE.BoxGeometry(.18, .14, raio), estrutMat, mocho3D.base, [Math.sin(a) * raio / 2, -1.28, Math.cos(a) * raio / 2], [0, a, 0]);
      if (temRodizios) mesh(new THREE.SphereGeometry(.18, 16, 12), new THREE.MeshStandardMaterial({ color: 0x20242b, roughness: .55 }), mocho3D.base, [Math.sin(a) * raio, -1.52, Math.cos(a) * raio]);
    }
  }
  if (temLombar) mesh(new THREE.SphereGeometry(.45, 28, 20), mocho3D.seat.material.clone(), mocho3D.extras, [0, 2.25 + elevacao, .66]);
  if (acessorios.includes('apoio-pes')) mesh(new THREE.TorusGeometry(.55, .07, 10, 32), estrutMat, mocho3D.extras, [0, -.45 + elevacao * .55, 0], [Math.PI / 2, 0, 0]);
  if (acessorios.includes('gancho')) mesh(new THREE.TorusGeometry(.18, .05, 10, 24, Math.PI), estrutMat, mocho3D.extras, [1.25 * escala, 1.12 + elevacao, 0], [0, 0, Math.PI / 2]);
  document.getElementById('backAngleValue').textContent = `${anguloBack}°`;
  document.getElementById('baseHeightValue').textContent = `${alturaBase} cm`;
  document.getElementById('viewerLabel').textContent = `${nomeOpt(material, CONFIG.materiais)} · ${corAssento} · ${alturaBase} cm`;
}

function atualizarMocho3D() {
  if (!mocho3D) return;
  const especificacoes = especificacoesConfiguradas();
  const ehSela = especificacoes.sela === 'Sim';
  const espumaAlta = especificacoes.espuma === '5 cm';
  const tamanhoSela = especificacoes.tamanhoSela;
  const escalaSela = tamanhoSela === 'Soft Plus' ? 1.24 : tamanhoSela === 'Soft' ? 1.12 : 1;
  const corAssento = cor3D(especificacoes.corAssento, 0x41454f);
  const estrutura = new THREE.MeshStandardMaterial({ color: cor3D(especificacoes.corEstrutura, especificacoes.pistao === 'M' ? 0xaeb7c3 : 0x4a5261), metalness: .72, roughness: .25 });

  if (mocho3D.formatoSela !== ehSela) {
    mocho3D.seat.geometry.dispose();
    mocho3D.seat.geometry = ehSela ? new THREE.SphereGeometry(1.45, 48, 32) : new THREE.CylinderGeometry(1.48, 1.58, .34, 48);
    mocho3D.formatoSela = ehSela;
  }
  mocho3D.seat.scale.set(ehSela ? 1.12 * escalaSela : 1, ehSela ? (espumaAlta ? .42 : .32) : (espumaAlta ? 1.22 : 1), ehSela ? .78 * escalaSela : 1);
  mocho3D.seat.position.y = 1.25;
  mocho3D.seat.material.color.setHex(corAssento);
  mocho3D.seat.material.roughness = .58;
  mocho3D.seatEdge.material.color.setHex(corAssento);
  mocho3D.column.material = estrutura;
  mocho3D.column.scale.y = especificacoes.pistao === 'M' ? 1.16 : 1;
  mocho3D.column.position.y = especificacoes.pistao === 'M' ? .12 : -.05;

  limparGrupo3D(mocho3D.back); limparGrupo3D(mocho3D.base); limparGrupo3D(mocho3D.extras);
  for (let i = 0; i < 5; i++) {
    const angulo = i * Math.PI * 2 / 5;
    mesh(new THREE.BoxGeometry(.18, .14, 1.45), estrutura, mocho3D.base, [Math.sin(angulo) * .72, -1.28, Math.cos(angulo) * .72], [0, angulo, 0]);
    mesh(new THREE.SphereGeometry(.18, 16, 12), new THREE.MeshStandardMaterial({ color: 0x20242b, roughness: .55 }), mocho3D.base, [Math.sin(angulo) * 1.45, -1.52, Math.cos(angulo) * 1.45]);
  }
  document.getElementById('viewerLabel').textContent = `Mocho sela ${tamanhoSela} · ${especificacoes.corAssento} · espuma ${especificacoes.espuma} · pistão ${especificacoes.pistao}`;
}

function renderMocho3D() {
  if (!mocho3D) return;
  const host = document.getElementById('mochoViewer');
  const width = host.clientWidth, height = host.clientHeight;
  if (!width || !height) return;
  mocho3D.renderer.setSize(width, height, false);
  mocho3D.camera.aspect = width / height;
  mocho3D.camera.position.set(5.7 / mocho3D.zoom, 4.2 / mocho3D.zoom, 7.2 / mocho3D.zoom);
  mocho3D.camera.lookAt(0, .15, 0);
  mocho3D.camera.updateProjectionMatrix();
  mocho3D.model.rotation.set(mocho3D.pitch, mocho3D.yaw, 0);
  mocho3D.renderer.render(mocho3D.scene, mocho3D.camera);
}

/* ============================================================
   ITENS
   ============================================================ */
function calcularPrecoUnitario() {
  return parseFloat(document.getElementById('valorRecebido')?.value) || 0;
}

function addItem() {
  adicionarItemConfigurado();
}

function adicionarItemConfigurado() {
  const especificacoes = especificacoesConfiguradas();
  const qtd = 1;
  const obs = document.getElementById('observacoes').value.trim();
  const detalhes = [
    `Espuma: ${especificacoes.espuma}`,
    `Pistão: ${especificacoes.pistao}`,
    `M. sela: ${especificacoes.sela}`,
    `Tamanho da sela: ${especificacoes.tamanhoSela}`,
    `Cor assento: ${especificacoes.corAssento}`,
    'Estrutura: metal cromado prata'
  ];
  if (obs) detalhes.push(`Obs: ${obs}`);
  const unitario = calcularPrecoUnitario();
  const configuracao = `Mocho sela ${especificacoes.tamanhoSela} · Linha de espuma ${especificacoes.espuma} · Pistão ${especificacoes.pistao} · Assento ${especificacoes.corAssento} · Estrutura metal cromado prata`;
  itens.push({
    id: ++itemCounter,
    descricao: 'Mocho Sela',
    detalhes: detalhes.join('; '),
    configuracao,
    qtd,
    unitario,
    subtotal: unitario * qtd
  });
  renderTabela();
  limparConfig();
  toast('Item configurado e adicionado ao pedido!');
}

function removeItem(id) {
  itens = itens.filter(i => i.id !== id);
  renderTabela();
  toast('Item removido.');
}

function limparConfig() {
  document.getElementById('observacoes').value = '';
  atualizarMocho3D();
}

function fmt(v) {
  const valor = Number(v) || 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2
  }).format(valor);
}

function calcTotais() {
  const subtotal = itens.reduce((s, i) => s + i.subtotal, 0);
  const descontoPct = parseFloat(document.getElementById('desconto').value) || 0;
  const desconto = subtotal * (descontoPct / 100);
  const frete = parseFloat(document.getElementById('frete').value) || 0;
  const total = subtotal - desconto + frete;
  return { subtotal, descontoPct, desconto, frete, total };
}

function renderTabela() {
  const tbody = document.getElementById('tbodyItens');
  const wrap = document.getElementById('tabelaWrap');
  const semItens = document.getElementById('semItens');
  const contador = document.getElementById('contadorItens');
  const totalQtd = itens.reduce((s, i) => s + i.qtd, 0);
  contador.textContent = totalQtd;

  if (itens.length === 0) {
    wrap.style.display = 'none';
    semItens.style.display = 'block';
  } else {
    wrap.style.display = 'block';
    semItens.style.display = 'none';
  }

  tbody.innerHTML = '';
  itens.forEach((item, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td class="desc-item"><b>${item.descricao}</b><br><span class="tag">${item.detalhes}</span></td>
      <td style="text-align:center;">${item.qtd}</td>
      <td style="text-align:right;">${fmt(item.unitario)}</td>
      <td style="text-align:right;">${fmt(item.subtotal)}</td>
      <td><button class="btn btn-danger" style="padding:6px 10px;" onclick="removeItem(${item.id})">✕</button></td>
    `;
    tbody.appendChild(tr);
  });

  renderTotais();
}

function renderTotais() {
  const { subtotal, descontoPct, desconto, frete, total } = calcTotais();
  const tfoot = document.getElementById('tfootItens');
  tfoot.innerHTML = `
    <tr><td colspan="3" style="text-align:right;">Subtotal</td><td style="text-align:right;">—</td><td style="text-align:right;">${fmt(subtotal)}</td><td></td></tr>
    <tr><td colspan="3" style="text-align:right;">Desconto (${descontoPct}%)</td><td style="text-align:right;">—</td><td style="text-align:right;">- ${fmt(desconto)}</td><td></td></tr>
    <tr><td colspan="3" style="text-align:right;">Frete</td><td style="text-align:right;">—</td><td style="text-align:right;">+ ${fmt(frete)}</td><td></td></tr>
    <tr class="total-row"><td colspan="3" style="text-align:right;">TOTAL</td><td style="text-align:right;">—</td><td style="text-align:right;">${fmt(total)}</td><td></td></tr>
  `;
  document.getElementById('resumoLabels').innerHTML = `
    <div class="row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
    <div class="row"><span>Desconto (${descontoPct}%)</span><span>- ${fmt(desconto)}</span></div>
    <div class="row"><span>Frete</span><span>+ ${fmt(frete)}</span></div>
    <div class="row total"><span>TOTAL</span><span>${fmt(total)}</span></div>
  `;
}

/* ============================================================
   DADOS DO PEDIDO
   ============================================================ */
function dadosPedido() {
  const campo = id => document.getElementById(id)?.value?.trim() || '';
  const pedido = campo('pedido') || 'NAO INFORMADO';
  const cliente = campo('cliente') || 'NAO INFORMADO';
  const telefone = campo('telefone') || 'NAO INFORMADO';
  const data = document.getElementById('data').value || new Date().toISOString().split('T')[0];
  const { subtotal, descontoPct, desconto, frete, total } = calcTotais();
  return {
    pedido, cliente, telefone, data, subtotal, descontoPct, desconto, frete, total,
    codigoEvento: campo('codigoEvento'), cpf: campo('cpfCnpj'), nascimento: campo('nascimento'), cnpj: campo('cnpj'),
    email: campo('email'), profissao: campo('profissao'), rua: campo('rua'), numero: campo('numero'),
    complemento: campo('complemento'), bairro: campo('bairro'), cidade: campo('cidade'), uf: campo('uf'), cep: campo('cep'),
    medidaAltura: campo('medidaAltura'), peso: campo('peso'), valorRecebido: parseFloat(campo('valorRecebido')) || 0,
    parcelas: Math.max(1, parseInt(campo('parcelas'), 10) || 1), valorParcela: parseFloat(campo('valorParcela')) || 0,
    espessura: campo('espessura'), pistao: campo('pistao'), corAssento: campo('corAssento'), corEstrutura: campo('corEstrutura'), representante: campo('representante'), localAssinatura: campo('localAssinatura'),
    mSela: true, tamanhoSela: campo('linhaSoft'), observacoesPedido: campo('observacoesPedido')
  };
}

function dataBrasileira(data) {
  if (!data) return '';
  const partes = data.split('-');
  return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : data;
}

function nomeArquivo(p) {
  return `Pedido_${p.pedido.replace(/[\\/:*?"<>|]/g, '_')}_${p.cliente.replace(/[\\/:*?"<>|]/g, '_')}`;
}

/* ============================================================
   EXPORTAÇÃO PDF
   ============================================================ */
function exportarPdfFabrica() {
  if (itens.length === 0) { toast('Adicione ao menos um item ao pedido.'); return; }
  if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
    toast('Biblioteca PDF indisponível - verifique a conexão com a internet.');
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const criarLogoParaPdf = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 720; canvas.height = 260;
    const ctx = canvas.getContext('2d');
    const navy = '#10143c'; const red = '#bb1722';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 14; ctx.strokeStyle = navy;
    ctx.beginPath(); ctx.arc(120, 88, 62, 0.27, Math.PI * 1.82); ctx.stroke();
    ctx.fillStyle = red;
    ctx.beginPath(); ctx.moveTo(37, 158); ctx.lineTo(192, 27); ctx.lineTo(112, 143); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(119, 85, 17, 0, Math.PI * 2); ctx.fill();
    ctx.textBaseline = 'alphabetic';
    ctx.font = '800 43px Arial'; ctx.fillStyle = red; ctx.fillText('DUO', 18, 218);
    ctx.font = '800 43px Arial'; ctx.fillStyle = navy; ctx.fillText('EQUILIBRIUM', 125, 218);
    ctx.font = '600 17px Arial'; ctx.fillStyle = navy; ctx.fillText('SOLUÇÕES ERGONÔMICAS', 54, 246);
    return canvas.toDataURL('image/png');
  };
  const p = dadosPedido();
  const pageW = 210, margem = 12, largura = pageW - margem * 2;
  const temLombar = itens.some(item => item.detalhes.includes('Apoio lombar'));
  const valorParcela = p.valorParcela || (p.total / p.parcelas);

  const texto = (valor, padrao = '') => String(valor || padrao);
  const linha = (x1, y1, x2, y2) => doc.line(x1, y1, x2, y2);
  const caixa = (x, y, w, h, rotulo, valor) => {
    doc.setDrawColor(25, 31, 42); doc.setLineWidth(.35); doc.rect(x, y, w, h);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.setTextColor(35, 40, 48);
    doc.text(rotulo.toUpperCase(), x + 2, y + 3.4);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.4); doc.setTextColor(18, 24, 35);
    const valorLinhas = doc.splitTextToSize(texto(valor), w - 4).slice(0, 2);
    doc.text(valorLinhas, x + 2, y + 8);
  };
  const check = (x, y, label, marcado) => {
    doc.rect(x, y - 3.2, 4, 4);
    if (marcado) { doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text('X', x + .7, y); }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7.2); doc.text(label, x + 6, y);
  };

  doc.setDrawColor(12, 16, 24); doc.setLineWidth(.8); doc.rect(margem, 10, largura, 277);
  doc.setLineWidth(.35);
  doc.addImage(criarLogoParaPdf(), 'PNG', 15, 12, 45, 18);
  doc.setFontSize(18); doc.text('Pedido de Fábrica', 194, 25, { align: 'right' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
  doc.text('CNPJ: 12.656.204/0001-64', 194, 31, { align: 'right' });
  doc.text('Tel.: (21) 97143-3650', 194, 35.5, { align: 'right' });
  doc.text('E-mail: duoequilibrium@gmail.com', 194, 40, { align: 'right' });
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5);
  doc.text(`Cód. do evento: ${texto(p.codigoEvento, '________________')}`, 105, 42, { align: 'center' });
  doc.text(`Nº: ${p.pedido}`, 194, 42, { align: 'right' });
  linha(margem, 44, pageW - margem, 44);

  caixa(14, 48, 115, 12, 'CPF', p.cpf);
  caixa(131, 48, 65, 12, 'Data de nascimento', dataBrasileira(p.nascimento));
  caixa(14, 61, 182, 11, 'Nome do titular', p.cliente);
  caixa(14, 73, 182, 11, 'Rua / Avenida', p.rua);
  caixa(14, 85, 135, 11, 'Complemento', p.complemento);
  caixa(151, 85, 45, 11, 'Número', p.numero);
  caixa(14, 97, 182, 11, 'Cidade', p.cidade);
  caixa(14, 109, 70, 11, 'CEP', p.cep);
  caixa(86, 109, 20, 11, 'UF', p.uf);
  caixa(108, 109, 88, 11, 'Bairro', p.bairro);
  caixa(14, 121, 88, 11, 'Celular', p.telefone);
  caixa(104, 121, 92, 11, 'Telefone', p.telefone);
  caixa(14, 133, 182, 11, 'E-mail', p.email);
  caixa(14, 145, 92, 11, 'Profissão', p.profissao);
  caixa(108, 145, 88, 11, 'CNPJ', p.cnpj);

  const yInfo = 159;
  doc.rect(14, yInfo, 80, 45);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.text('INFORMAÇÕES ADICIONAIS', 18, yInfo + 6);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
  doc.text(`ALTURA: ${texto(p.medidaAltura, '________________')}`, 22, yInfo + 14);
  doc.text(`PESO: ${texto(p.peso, '________________')}`, 22, yInfo + 22);
  doc.text(`ASSENTO: ${texto(p.corAssento, '________________')}`, 22, yInfo + 30);
  doc.text('ESTRUTURA: METAL CROMADO PRATA', 22, yInfo + 36);
  check(22, yInfo + 43, 'MOCHO SELA', true);

  const linhasProduto = itens.slice(0, 5).map((item, indice) => [
    item.descricao.length > 42 ? `${item.descricao.slice(0, 39)}...` : item.descricao,
    indice === 0 ? fmt(p.valorRecebido) : '',
    indice === 0 ? String(p.parcelas) : '',
    fmt(item.subtotal)
  ]);
  while (linhasProduto.length < 5) linhasProduto.push(['', '', '', '']);
  doc.autoTable({
    startY: yInfo, margin: { left: 98, right: 14 }, tableWidth: 98,
    head: [['PRODUTO', 'VALOR RECEBIDO', 'Nº PARCELAS', 'VALOR']], body: linhasProduto,
    theme: 'grid', styles: { fontSize: 6.7, cellPadding: 1.5, lineColor: [25, 31, 42], lineWidth: .3, valign: 'middle' },
    headStyles: { fillColor: [255, 255, 255], textColor: [18, 24, 35], fontStyle: 'bold', halign: 'center' },
    columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 22, halign: 'center' }, 2: { cellWidth: 17, halign: 'center' }, 3: { cellWidth: 19, halign: 'right' } }
  });

  const yOpcoes = 205;
  doc.rect(14, yOpcoes, 80, 40);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(7); doc.text('CONFIGURAÇÃO DE FÁBRICA', 18, yOpcoes + 6);
  check(19, yOpcoes + 15, 'ESPUMA 3 CM', p.espessura === '3 cm');
  check(49, yOpcoes + 15, 'ESPUMA 5 CM', p.espessura === '5 cm');
  check(19, yOpcoes + 24, 'PISTÃO P', p.pistao === 'P');
  check(49, yOpcoes + 24, 'PISTÃO M', p.pistao === 'M');
  check(19, yOpcoes + 34, 'SELA SOFT', p.tamanhoSela === 'Soft');
  check(49, yOpcoes + 34, 'SELA SOFT PLUS', p.tamanhoSela === 'Soft Plus');

  const obsItens = itens.map(item => item.detalhes.match(/Obs: (.*?)(; |$)/)?.[1]).filter(Boolean);
  const configuracoesItens = itens.map((item, indice) => item.configuracao ? `Item ${indice + 1}: ${item.configuracao}` : '').filter(Boolean);
  const observacoes = [p.observacoesPedido, ...configuracoesItens, ...obsItens, itens.length > 5 ? `Mais ${itens.length - 5} item(ns) no pedido.` : ''].filter(Boolean).join(' | ');
  doc.rect(98, yOpcoes, 98, 40);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text('Observações:', 102, yOpcoes + 7);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
  const linhasObs = doc.splitTextToSize(texto(observacoes, 'Sem observações adicionais.'), 88).slice(0, 5);
  doc.text(linhasObs, 102, yOpcoes + 14);
  linha(102, yOpcoes + 34, 190, yOpcoes + 34); linha(102, yOpcoes + 38, 190, yOpcoes + 38);

  doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5);
  doc.text(`TOTAL DO PEDIDO: ${fmt(p.total)}`, 194, 251, { align: 'right' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
  doc.text(`Local: ${texto(p.localAssinatura, '________________________')}   ${dataBrasileira(p.data)}`, 98, 260);
  linha(18, 275, 90, 275); linha(118, 275, 190, 275);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
  doc.text('REPRESENTANTE', 54, 280, { align: 'center' });
  doc.text('ASS. CLIENTE', 154, 280, { align: 'center' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.text(texto(p.representante), 54, 272, { align: 'center' });

  doc.save(`${nomeArquivo(p)}.pdf`);
  toast('Pedido de fábrica em PDF gerado com sucesso!');
}

function exportarPdf() {
  return exportarPdfFabrica();
}

function exportarPdfLegadoDesativado() {
  if (itens.length === 0) { toast('Adicione ao menos um item ao pedido.'); return; }
  if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
    toast('Biblioteca PDF indisponível — verifique a conexão com a internet.');
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const p = dadosPedido();
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margem = 14;

  doc.setFillColor(22, 32, 51);
  doc.rect(0, 0, pageW, 34, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(CONFIG.empresa, margem, 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(190, 190, 190);
  doc.text(CONFIG.slogan, margem, 22);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('PEDIDO DE COMPRA', pageW - margem, 15, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(190, 190, 190);
  doc.text(`Nº ${p.pedido} · ${p.data}`, pageW - margem, 22, { align: 'right' });

  let y = 46;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(22, 32, 51);
  doc.text('DADOS DO CLIENTE', margem, y);
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.4);
  doc.line(margem, y + 2, pageW - margem, y + 2);
  y += 9;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(40, 40, 40);
  doc.text(`Cliente:   ${p.cliente}`, margem, y);
  doc.text(`Telefone:   ${p.telefone}`, margem + 100, y);
  y += 8;
  doc.text(`Data:   ${p.data}`, margem, y);
  doc.text(`Nº do Pedido:   ${p.pedido}`, margem + 100, y);
  y += 10;

  const body = itens.map((item, idx) => [
    String(idx + 1),
    item.descricao,
    String(item.qtd),
    fmt(item.unitario),
    fmt(item.subtotal)
  ]);
  const totalLinhas = itens.reduce((s, i) => s + i.qtd, 0);

  doc.autoTable({
    startY: y,
    head: [['#', 'Descrição', 'Qtd', 'Preço Unitário', 'Subtotal']],
    body,
    foot: [[
      { content: 'TOTAL DE ITENS', colSpan: 2, styles: { halign: 'right', fontStyle: 'bold' } },
      { content: String(totalLinhas), styles: { halign: 'center', fontStyle: 'bold' } },
      { content: '', styles: { halign: 'right' } },
      { content: fmt(p.subtotal), styles: { halign: 'right', fontStyle: 'bold' } }
    ]],
    theme: 'grid',
    headStyles: { fillColor: [22, 32, 51], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'left' },
    bodyStyles: { fontSize: 8.5, textColor: [50, 50, 50] },
    footStyles: { fillColor: [240, 240, 240], textColor: [22, 32, 51], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      2: { cellWidth: 14, halign: 'center' },
      3: { cellWidth: 32, halign: 'right' },
      4: { cellWidth: 32, halign: 'right' }
    },
    margin: { left: margem, right: margem }
  });

  let obsText = [];
  itens.forEach(i => {
    const m = i.detalhes.match(/Obs: (.*?)(; |$)/);
    if (m) obsText.push(m[1]);
  });

  y = doc.lastAutoTable.finalY + 12;
  if (obsText.length) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(22, 32, 51);
    doc.text('OBSERVAÇÕES', margem, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(90, 90, 90);
    doc.text(obsText.map(o => `• ${o}`), margem, y);
    y += obsText.length * 5 + 8;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(22, 32, 51);
  const colValor = pageW - margem;
  const colLabel = colValor - 70;

  const linhasResumo = [
    ['Subtotal', p.subtotal],
    [`Desconto (${p.descontoPct}%)`, -p.desconto],
    ['Frete', p.frete]
  ];
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(50, 50, 50);
  linhasResumo.forEach(([label, valor]) => {
    doc.text(label, colLabel, y, { align: 'right' });
    doc.text(fmt(valor), colValor, y, { align: 'right' });
    y += 6;
  });
  doc.setFillColor(22, 32, 51);
  doc.rect(colLabel - 4, y - 4.5, colValor - colLabel + 4, 9, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL', colLabel, y, { align: 'right' });
  doc.text(fmt(p.total), colValor, y, { align: 'right' });
  y += 20;

  doc.setDrawColor(190, 190, 190);
  doc.setLineWidth(0.4);
  const meio = pageW / 2;
  doc.line(margem, y, margem + 70, y);
  doc.line(meio, y, meio + 70, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 120, 120);
  doc.text('Assinatura do Cliente', margem + 12, y + 5);
  doc.text(CONFIG.empresa, meio + 16, y + 5);

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`${CONFIG.empresa} · Documento gerado eletronicamente.`, pageW / 2, pageH - 8, { align: 'center' });

  doc.save(`${nomeArquivo(p)}.pdf`);
  toast('PDF gerado com sucesso!');
}

/* ============================================================
   EXPORTAÇÃO XLSX e CSV
   ============================================================ */
function criarLinhasPlanilha() {
  const p = dadosPedido();
  const linhas = [];
  linhas.push([CONFIG.empresa.toUpperCase()]);
  linhas.push([]);
  linhas.push(['Nº do Pedido', p.pedido]);
  linhas.push(['Cliente', p.cliente]);
  linhas.push(['Telefone', p.telefone]);
  linhas.push(['Data', p.data]);
  linhas.push([]);
  linhas.push(['ITENS DO PEDIDO']);
  linhas.push(['#', 'Descrição', 'Quantidade', 'Preço Unitário (R$)', 'Subtotal (R$)']);
  itens.forEach((item, idx) => {
    linhas.push([idx + 1, `${item.descricao} — ${item.detalhes}`, item.qtd, item.unitario.toFixed(2).replace('.', ','), item.subtotal.toFixed(2).replace('.', ',')]);
  });
  linhas.push([]);
  linhas.push(['Subtotal', '', '', '', p.subtotal.toFixed(2).replace('.', ',')]);
  linhas.push([`Desconto (${p.descontoPct}%)`, '', '', '', p.desconto.toFixed(2).replace('.', ',')]);
  linhas.push(['Frete', '', '', '', p.frete.toFixed(2).replace('.', ',')]);
  linhas.push(['TOTAL', '', '', '', p.total.toFixed(2).replace('.', ',')]);
  return linhas;
}

function exportarXlsx() {
  if (itens.length === 0) { toast('Adicione ao menos um item ao pedido.'); return; }
  if (typeof XLSX === 'undefined') {
    toast('Biblioteca Excel indisponível — verifique a conexão com a internet.');
    return;
  }
  const p = dadosPedido();
  const ws = XLSX.utils.aoa_to_sheet(criarLinhasPlanilha());
  ws['!cols'] = [{ wch: 4 }, { wch: 60 }, { wch: 12 }, { wch: 18 }, { wch: 16 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Pedido');
  XLSX.writeFile(wb, `${nomeArquivo(p)}.xlsx`);
  toast('Planilha Excel gerada!');
}

function exportarCsv() {
  if (itens.length === 0) { toast('Adicione ao menos um item ao pedido.'); return; }
  const p = dadosPedido();
  const csv = criarLinhasPlanilha().map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';')).join('\r\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${nomeArquivo(p)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast('Arquivo CSV gerado!');
}

/* ============================================================
   HISTÓRICO SIMULADO — PONTO DE INTEGRAÇÃO PARA O BACK-END
   ============================================================ */
const HISTORICO_PEDIDOS = [
  { id: 'PED-2026-041', cliente: 'Clínica Sorriso Prime', nome: 'Dra. Marina Costa', telefone: '(21) 98841-2964', email: 'marina@sorrisoprime.com.br', data: '08/08/2026', produto: 'Mocho Sela Soft Plus', valor: 1290, status: 'Em produção', espuma: '5 cm', pistao: 'M', sela: 'Sim', linha: 'Soft Plus', itens: 2 },
  { id: 'PED-2026-040', cliente: 'Studio Helena Aesthetics', nome: 'Helena Pires', telefone: '(21) 97612-4408', email: 'contato@studiohelena.com.br', data: '06/08/2026', produto: 'Mocho Estética Balance', valor: 849.9, status: 'Confirmado', espuma: '3 cm', pistao: 'P', sela: 'Não', linha: 'Soft', itens: 1 },
  { id: 'PED-2026-039', cliente: 'Dr. Rafael Nogueira', nome: 'Dr. Rafael Nogueira', telefone: '(21) 99120-8173', email: 'rafael@odontonogueira.com.br', data: '04/08/2026', produto: 'Mocho Clínico Pro', valor: 1549.8, status: 'Em produção', espuma: '5 cm', pistao: 'M', sela: 'Sim', linha: 'Soft Plus', itens: 2 },
  { id: 'PED-2026-038', cliente: 'Odonto Vida Centro', nome: 'Carla Menezes', telefone: '(21) 98274-1160', email: 'compras@odontovida.com.br', data: '01/08/2026', produto: 'Mocho Compact Minimal', valor: 699.9, status: 'Confirmado', espuma: '3 cm', pistao: 'P', sela: 'Não', linha: 'Padrão', itens: 1 }
];

let pedidoHistoricoAtual = null;

function iniciarGraficoPedidos() {
  const canvas = document.getElementById('graficoPedidos');
  if (!canvas || !window.Chart) return;
  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: ['Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
      datasets: [
        { label: 'Faturamento (R$)', data: [8400, 10950, 9250, 13480, 15620, 18490], backgroundColor: 'rgba(197,28,42,.78)', borderRadius: 7, borderSkipped: false },
        { label: 'Pedidos', data: [11, 14, 12, 18, 20, 24], type: 'line', yAxisID: 'pedidos', borderColor: '#8d82ff', backgroundColor: '#8d82ff', pointBackgroundColor: '#f5f6ff', pointBorderColor: '#8d82ff', pointRadius: 4, tension: .38, borderWidth: 3 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#c6cae6', usePointStyle: true, boxWidth: 9, font: { family: 'Inter', size: 11 } } }, tooltip: { backgroundColor: '#151837', titleColor: '#fff', bodyColor: '#dfe2fb', borderColor: 'rgba(161,171,230,.2)', borderWidth: 1 } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#9097bc', font: { family: 'Inter' } }, border: { display: false } },
        y: { beginAtZero: true, grid: { color: 'rgba(161,171,230,.12)' }, ticks: { color: '#9097bc', callback: valor => `R$ ${Number(valor / 1000).toFixed(0)}k` }, border: { display: false } },
        pedidos: { position: 'right', beginAtZero: true, grid: { drawOnChartArea: false }, ticks: { color: '#9097bc', stepSize: 5 }, border: { display: false } }
      }
    }
  });
}

function iniciarNavegacaoDashboard() {
  const botoes = document.querySelectorAll('[data-dashboard-nav]');
  const paginas = document.querySelectorAll('[data-dashboard-page]');
  const navegar = destino => {
    paginas.forEach(pagina => pagina.hidden = pagina.dataset.dashboardPage !== destino);
    botoes.forEach(botao => botao.classList.toggle('active', botao.dataset.dashboardNav === destino));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  botoes.forEach(botao => botao.addEventListener('click', () => navegar(botao.dataset.dashboardNav)));
}

function renderHistoricoPedidos() {
  const lista = document.getElementById('historicoPedidos');
  lista.innerHTML = HISTORICO_PEDIDOS.map(pedido => {
    const emProducao = pedido.status === 'Em produção';
    return `<article class="historico-item">
      <div class="historico-topo"><div><strong>${pedido.id}</strong><span>${pedido.cliente} · ${pedido.data}</span></div><span class="status-pedido${emProducao ? ' producao' : ''}">${pedido.status}</span></div>
      <span>${pedido.produto} · ${pedido.itens} ${pedido.itens === 1 ? 'item' : 'itens'}</span>
      <div class="historico-valor">${fmt(pedido.valor)}</div>
      <div class="historico-acoes"><button class="btn btn-outline" type="button" data-history-view="${pedido.id}">Ver dados</button><button class="btn btn-ghost" type="button" data-history-pdf="${pedido.id}">PDF</button></div>
    </article>`;
  }).join('');

  lista.querySelectorAll('[data-history-view]').forEach(botao => botao.addEventListener('click', () => abrirHistorico(botao.dataset.historyView)));
  lista.querySelectorAll('[data-history-pdf]').forEach(botao => botao.addEventListener('click', () => baixarPdfHistorico(botao.dataset.historyPdf)));
}

function abrirHistorico(id) {
  const pedido = HISTORICO_PEDIDOS.find(item => item.id === id);
  if (!pedido) return;
  pedidoHistoricoAtual = pedido;
  document.getElementById('historyDialogTitle').textContent = `${pedido.id} · ${pedido.cliente}`;
  const emProducao = pedido.status === 'Em produção';
  document.getElementById('historyDialogOverview').innerHTML = `
    <div class="history-product"><small>Produto registrado</small><strong>${pedido.produto}</strong><span class="status-pedido${emProducao ? ' producao' : ''}">${pedido.status}</span></div>
    <div class="history-total"><small>Valor total</small><strong>${fmt(pedido.valor)}</strong></div>`;
  document.getElementById('historyDialogDetails').innerHTML = [
    ['Código', pedido.id], ['Empresa / clínica', pedido.cliente], ['Nome', pedido.nome], ['Telefone', pedido.telefone], ['E-mail', pedido.email], ['Data', pedido.data], ['Itens', `${pedido.itens} ${pedido.itens === 1 ? 'item' : 'itens'}`]
  ].map(([rotulo, valor]) => `<div class="history-detail"><small>${rotulo}</small><strong>${valor}</strong></div>`).join('');
  document.getElementById('historyDialogFabricacao').innerHTML = [
    ['Espuma', pedido.espuma], ['Pistão', pedido.pistao], ['Modelo sela', pedido.sela], ['Linha de espuma', pedido.linha]
  ].map(([rotulo, valor]) => `<div class="history-detail"><small>${rotulo}</small><strong>${valor}</strong></div>`).join('');
  document.getElementById('historyDialog').showModal();
}

function baixarPdfHistorico(id) {
  const pedido = HISTORICO_PEDIDOS.find(item => item.id === id);
  if (!pedido) return;
  if (!window.jspdf?.jsPDF) { toast('Biblioteca PDF indisponível.'); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setFillColor(16, 20, 60); doc.rect(0, 0, 210, 36, 'F');
  doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(17); doc.text('DUO EQUILIBRIUM', 16, 18);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.text('SOLUÇÕES ERGONÔMICAS', 16, 24);
  doc.setFontSize(14); doc.text('Resumo de pedido', 194, 18, { align: 'right' });
  doc.setTextColor(16, 20, 60); doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.text(pedido.id, 16, 53);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.text(`Cliente: ${pedido.cliente}`, 16, 62); doc.text(`Data: ${pedido.data}`, 16, 69);
  doc.setDrawColor(220, 224, 235); doc.line(16, 77, 194, 77);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text('ITEM REGISTRADO', 16, 88);
  doc.setFont('helvetica', 'normal'); doc.text(pedido.produto, 16, 96); doc.text(`${pedido.itens} ${pedido.itens === 1 ? 'item' : 'itens'}`, 16, 103);
  doc.setFont('helvetica', 'bold'); doc.text('CONFIGURAÇÃO DE FÁBRICA', 16, 119);
  doc.setFont('helvetica', 'normal');
  [['Espuma', pedido.espuma], ['Pistão', pedido.pistao], ['Modelo sela', pedido.sela], ['Linha de espuma', pedido.linha], ['Status', pedido.status]].forEach(([chave, valor], indice) => doc.text(`${chave}: ${valor}`, 16, 128 + indice * 8));
  doc.setFillColor(187, 23, 34); doc.roundedRect(16, 180, 178, 22, 3, 3, 'F');
  doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.text('TOTAL DO PEDIDO', 22, 190); doc.setFontSize(14); doc.text(fmt(pedido.valor), 188, 192, { align: 'right' });
  doc.setTextColor(95, 99, 126); doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.text('Documento simulado para consulta no painel de pedidos.', 105, 280, { align: 'center' });
  doc.save(`${pedido.id}.pdf`);
  toast(`PDF de ${pedido.id} baixado.`);
}

/* ============================================================
   NOVO PEDIDO
   ============================================================ */
function novoPedido() {
  itens = [];
  itemCounter = 0;
  document.getElementById('cliente').value = '';
  document.getElementById('telefone').value = '';
  document.getElementById('pedido').value = '';
  document.getElementById('desconto').value = 0;
  document.getElementById('frete').value = 0;
  document.getElementById('data').value = '';
  ['codigoEvento', 'cpfCnpj', 'nascimento', 'cnpj', 'email', 'profissao', 'rua', 'numero', 'complemento', 'bairro', 'cidade', 'uf', 'cep', 'medidaAltura', 'peso', 'representante', 'localAssinatura', 'observacoesPedido'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('valorRecebido').value = 0;
  document.getElementById('parcelas').value = 1;
  document.getElementById('valorParcela').value = 0;
  document.getElementById('espessura').value = '';
  document.getElementById('pistao').value = '';
  document.getElementById('mSela').value = '1';
  document.getElementById('linhaSoft').value = '';
  document.getElementById('corAssento').value = 'Preto';
  document.getElementById('corEstrutura').value = 'Cromado';
  limparConfig();
  renderTabela();
  toast('Novo pedido iniciado.');
}

/* ============================================================
   TOAST E INICIALIZAÇÃO
   ============================================================ */
let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('data').value = new Date().toISOString().split('T')[0];
  CAMPOS_FABRICACAO.forEach(id => document.getElementById(id).addEventListener('change', () => {
    atualizarMocho3D();
  }));
  renderHistoricoPedidos();
  iniciarGraficoPedidos();
  iniciarNavegacaoDashboard();
  const dialogHistorico = document.getElementById('historyDialog');
  document.getElementById('historyDialogClose').addEventListener('click', () => dialogHistorico.close());
  document.getElementById('historyDialogBack').addEventListener('click', () => dialogHistorico.close());
  document.getElementById('historyDialogPdf').addEventListener('click', () => {
    if (pedidoHistoricoAtual) baixarPdfHistorico(pedidoHistoricoAtual.id);
  });
  dialogHistorico.addEventListener('click', evento => {
    if (evento.target === dialogHistorico) dialogHistorico.close();
  });

  iniciarMocho3D();
  document.querySelector('.configurator').addEventListener('change', atualizarMocho3D);

  document.getElementById('btnAdd').addEventListener('click', addItem);
  document.getElementById('btnLimparConfig').addEventListener('click', limparConfig);
  document.getElementById('btnPdf').addEventListener('click', exportarPdf);
  document.getElementById('btnXlsx').addEventListener('click', exportarXlsx);
  document.getElementById('btnCsv').addEventListener('click', exportarCsv);
  document.getElementById('btnNovo').addEventListener('click', novoPedido);
  ['desconto', 'frete'].forEach(id => document.getElementById(id).addEventListener('input', renderTotais));

  renderTabela();
});
