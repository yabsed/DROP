const map = L.map('map', { zoomControl: false }).setView([37.5271, 126.9326], 15);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);

let isDropMode = false;
let selectedLatLng = null;
let currentLayer = 'drop'; 
let markers = { drop: [], place: [] };
let currentEmoji = '🏃';

let activeContext = { type: null, id: null, data: null }; 
let activeInterval = null;
let tempMedia = { create: {url:null}, comment: {url:null} };

// --- 드래그 & 스와이프 로직 ---
let dragStartY = 0;
let dragCurrentY = 0;
let isDragging = false;
let activeDragSheet = null;

document.querySelectorAll('.drag-area').forEach(area => {
    area.addEventListener('touchstart', (e) => {
        activeDragSheet = e.target.closest('.bottom-sheet');
        if(!activeDragSheet) return;
        dragStartY = e.touches[0].clientY;
        isDragging = true;
        activeDragSheet.style.transition = 'none'; 
    });

    area.addEventListener('touchmove', (e) => {
        if (!isDragging || !activeDragSheet) return;
        dragCurrentY = e.touches[0].clientY;
        const diff = dragCurrentY - dragStartY;

        if (diff > 0) activeDragSheet.style.transform = `translateY(${diff}px)`;
        else if (diff < 0 && !activeDragSheet.classList.contains('fullscreen')) {
            activeDragSheet.style.transform = `translateY(${diff}px)`;
        }
    });

    area.addEventListener('touchend', (e) => {
        if (!isDragging || !activeDragSheet) return;
        isDragging = false;
        activeDragSheet.style.transition = ''; 
        activeDragSheet.style.transform = ''; 

        const diff = dragCurrentY - dragStartY;
        if (diff < -40) activeDragSheet.classList.add('fullscreen');
        else if (diff > 80) closeSheets();
        else if (diff > 30 && activeDragSheet.classList.contains('fullscreen')) activeDragSheet.classList.remove('fullscreen');
        
        activeDragSheet = null;
    });
});

// --- 레이어 스위칭 로직 ---
function switchLayer(layer) {
    currentLayer = layer;
    document.getElementById('btn-layer-drop').classList.toggle('active', layer === 'drop');
    document.getElementById('btn-layer-place').classList.toggle('active', layer === 'place');
    document.getElementById('btn-layer-record').classList.toggle('active', layer === 'record');
    
    const fab = document.getElementById('fab-drop');
    const recordView = document.getElementById('record-view');
    
    closeSheets();
    resetDropMode();

    if (layer === 'record') {
        recordView.classList.add('active');
        fab.style.display = 'none';
    } else {
        recordView.classList.remove('active');
        fab.style.display = (layer === 'drop') ? 'flex' : 'none';
        renderLayers();
    }
}

// --- 지도 기능 (Drop, Place) ---
function toggleDropMode() {
    if (currentLayer !== 'drop') switchLayer('drop');
    isDropMode = !isDropMode;
    const fab = document.getElementById('fab-drop');
    const guide = document.getElementById('guide-msg');
    
    if (isDropMode) {
        fab.classList.add('cancel');
        guide.style.display = 'block';
        map.getContainer().style.cursor = 'crosshair';
    } else resetDropMode();
}

function resetDropMode() {
    isDropMode = false;
    document.getElementById('fab-drop').classList.remove('cancel');
    document.getElementById('guide-msg').style.display = 'none';
    map.getContainer().style.cursor = '';
}

map.on('click', (e) => {
    if (!isDropMode) return;
    selectedLatLng = e.latlng;
    openSheet('sheet-create');
    resetDropMode();
});

function renderLayers() {
    markers.drop.forEach(m => map.removeLayer(m));
    markers.place.forEach(m => map.removeLayer(m));
    markers.drop = []; markers.place = [];
    
    if (currentLayer === 'drop') renderDrops();
    else if (currentLayer === 'place') renderPlaces();
}

function renderDrops() {
    let drops = JSON.parse(localStorage.getItem('drops') || '[]');
    const now = Date.now();
    drops = drops.filter(d => (now - d.createdAt) < 15 * 60 * 1000); 
    localStorage.setItem('drops', JSON.stringify(drops));

    drops.forEach(d => {
        const icon = L.divIcon({ className: 'custom-div-icon', html: `<div class="emoji-marker">${d.emoji}</div>`, iconSize: [40, 40] });
        const marker = L.marker([d.lat, d.lng], { icon }).addTo(map);
        marker.on('click', () => { activeContext = { type: 'drop', id: d.id, data: d }; openDetailView(); });
        markers.drop.push(marker);
    });
}

function submitDrop() {
    const text = document.getElementById('input-text').value;
    if (!text.trim() && !tempMedia.create.url) return;
    
    const drops = JSON.parse(localStorage.getItem('drops') || '[]');
    drops.push({ id: Date.now(), lat: selectedLatLng.lat, lng: selectedLatLng.lng, emoji: currentEmoji, text: text, createdAt: Date.now(), author: `러너_${Math.floor(Math.random()*9000)+1000}`, media: tempMedia.create.url ? {...tempMedia.create} : null });
    localStorage.setItem('drops', JSON.stringify(drops));
    
    document.getElementById('input-text').value = '';
    clearMedia('create'); renderLayers(); closeSheets();
}

function renderPlaces() {
    // ✨ 스팟 이모지 다양화 ✨
    const places = [
        { id: 'spot_1', name: '여의도 물빛광장 편의점', lat: 37.5271, lng: 126.9326, emoji: '🏪' },
        { id: 'spot_2', name: '반포 달빛무지개분수 화장실', lat: 37.5105, lng: 126.9960, emoji: '🚻' },
        { id: 'spot_3', name: '잠수교 남단 식수대', lat: 37.5135, lng: 126.9955, emoji: '🚰' },
        { id: 'spot_4', name: '마포대교 아래 쉼터 벤치', lat: 37.5332, lng: 126.9368, emoji: '🪑' },
        { id: 'spot_5', name: '여의나루역 짐보관소', lat: 37.5270, lng: 126.9320, emoji: '🎒' }
    ];
    places.forEach(p => {
        const icon = L.divIcon({ className: 'custom-div-icon', html: `<div class="emoji-marker">${p.emoji}</div>`, iconSize: [40, 40] });
        const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
        marker.on('click', () => { activeContext = { type: 'place', id: p.id, data: { text: p.name, emoji: p.emoji, createdAt: Date.now() } }; openDetailView(); });
        markers.place.push(marker);
    });
}

function openDetailView() {
    const c = activeContext;
    document.getElementById('detail-emoji').innerText = c.data.emoji;
    document.getElementById('detail-title').innerText = c.data.text;
    
    const subEl = document.getElementById('detail-subtitle');
    document.getElementById('detail-main-media').innerHTML = '';

    if (c.type === 'drop') {
        subEl.style.color = '#ff3b30';
        startTimer(c.data.createdAt, subEl);
        document.getElementById('detail-author').innerText = `👤 ${c.data.author}`;
    } else {
        subEl.style.color = '#888';
        subEl.innerText = '러닝 코스의 고정 스팟입니다.';
        if (activeInterval) clearInterval(activeInterval);
        document.getElementById('detail-author').innerText = `📍 러닝 스팟`;
    }
    if (c.data.media) document.getElementById('detail-main-media').innerHTML = `<img class="feed-media" src="${c.data.media.url}">`;

    renderComments();
    openSheet('sheet-detail');
}

function renderComments() {
    const list = document.getElementById('detail-comment-list');
    const key = `comments_${activeContext.type}_${activeContext.id}`;
    const comments = JSON.parse(localStorage.getItem(key) || '[]');
    list.innerHTML = comments.length ? '' : '<div style="text-align:center;color:#999;padding:20px 0;font-size:13px;">가장 먼저 흔적을 남겨보세요!</div>';
    
    comments.forEach(c => {
        let mediaHTML = c.media ? `<img class="feed-media" src="${c.media.url}">` : '';
        list.innerHTML += `<div class="feed-item"><div class="feed-header">익명 러너</div><div>${c.text}</div>${mediaHTML}</div>`;
    });
    const scrollable = document.getElementById('detail-scroll-area');
    setTimeout(() => scrollable.scrollTop = scrollable.scrollHeight, 10);
}

function submitComment() {
    const input = document.getElementById('detail-comment-input');
    if (!input.value.trim() && !tempMedia.comment.url) return;
    
    const key = `comments_${activeContext.type}_${activeContext.id}`;
    const comments = JSON.parse(localStorage.getItem(key) || '[]');
    comments.push({ text: input.value, time: Date.now(), media: tempMedia.comment.url ? {...tempMedia.comment} : null });
    localStorage.setItem(key, JSON.stringify(comments));
    
    input.value = ''; clearMedia('comment'); renderComments();
}

// --- ✨ 운동 기록 데이터 및 로직 ✨ ---
const recordData = {
    '심장강화점수': { icon: '❤️', unit: '점', desc: '심박수 구간 기반 환산 점수', D: '32', W: '145', M: '580' },
    '걸음수': { icon: '👣', unit: '걸음', desc: '기기를 소지하고 이동한 총 걸음', D: '8,432', W: '54,200', M: '210,500' },
    '소모칼로리': { icon: '🔥', unit: 'kcal', desc: '활동 및 러닝 소모 칼로리', D: '420', W: '2,800', M: '11,200' },
    '이동거리': { icon: '📍', unit: 'km', desc: 'GPS 기반 총 이동 거리', D: '5.2', W: '32.5', M: '120.4' },
    '운동시간': { icon: '⏱️', unit: '분', desc: '순수 러닝/걷기 활성 시간', D: '45', W: '280', M: '1,150' }
};

let currentRecordKey = '';

function openRecordDetail(key) {
    currentRecordKey = key;
    const data = recordData[key];
    
    document.getElementById('record-detail-icon').innerText = data.icon;
    document.getElementById('record-detail-title').innerText = key;
    document.getElementById('record-detail-desc').innerText = data.desc;
    
    // 초기 탭(일간) 설정
    changeRecordTab('D');
    openSheet('sheet-record-detail');
}

function changeRecordTab(period) {
    // 탭 스타일 변경
    document.querySelectorAll('.stat-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${period}`).classList.add('active');
    
    // 데이터 반영
    const data = recordData[currentRecordKey];
    document.getElementById('record-detail-value').innerHTML = `${data[period]}<span style="font-size:16px; color:#888; font-weight:700; margin-left:4px;">${data.unit}</span>`;
    
    // 설명 텍스트 변경
    const periodText = period === 'D' ? '오늘 하루' : (period === 'W' ? '이번 주' : '이번 달');
    document.getElementById('record-detail-period-text').innerText = `${periodText} 누적 기록입니다.`;
}


// --- 유틸리티 ---
function handleFileUpload(event, target) {
    const file = event.target.files[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    tempMedia[target] = { url: objectUrl };
    document.getElementById(`${target}-media-preview-box`).classList.add('active');
    document.getElementById(`${target}-media-preview`).src = objectUrl;
    document.getElementById(`${target}-camera-btn`).classList.add('has-file');
}

function clearMedia(target) {
    tempMedia[target] = { url: null };
    document.getElementById(`${target}-media-preview-box`).classList.remove('active');
    document.getElementById(`${target}-file-input`).value = '';
    document.getElementById(`${target}-camera-btn`).classList.remove('has-file');
}

function selectEmoji(el, emoji) {
    document.querySelectorAll('.emoji-option').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected'); currentEmoji = emoji;
}

function openSheet(id) { 
    document.querySelectorAll('.bottom-sheet').forEach(s => { s.classList.remove('active', 'fullscreen'); });
    document.getElementById('overlay').classList.add('active');
    document.getElementById(id).classList.add('active'); 
}

function closeSheets() {
    document.getElementById('overlay').classList.remove('active');
    document.querySelectorAll('.bottom-sheet').forEach(s => { s.classList.remove('active', 'fullscreen'); });
    if (activeInterval) clearInterval(activeInterval);
    ['create', 'comment'].forEach(clearMedia);
}

function startTimer(created, targetElement) {
    if (activeInterval) clearInterval(activeInterval);
    activeInterval = setInterval(() => {
        const rem = Math.max(0, (15 * 60) - Math.floor((Date.now() - created) / 1000));
        targetElement.innerText = `⏳ ${Math.floor(rem/60)}:${(rem%60).toString().padStart(2,'0')} 남음`;
        if (rem === 0) { closeSheets(); renderLayers(); }
    }, 1000);
}

renderLayers();
