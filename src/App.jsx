import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

const SPOTS = [
  { id: 'spot_1', name: '여의도 물빛광장 편의점', lat: 37.5271, lng: 126.9326, emoji: '🏪' },
  { id: 'spot_2', name: '반포 달빛무지개분수 화장실', lat: 37.5105, lng: 126.996, emoji: '🚻' },
  { id: 'spot_3', name: '잠수교 남단 식수대', lat: 37.5135, lng: 126.9955, emoji: '🚰' },
  { id: 'spot_4', name: '마포대교 아래 쉼터 벤치', lat: 37.5332, lng: 126.9368, emoji: '🪑' },
  { id: 'spot_5', name: '여의나루역 짐보관소', lat: 37.527, lng: 126.932, emoji: '🎒' }
];

const EMOJIS = ['🏃', '🔥', '💦', '⏱️', '🎧', '📸', '🏅', '👟', '🐶', '🚴', '🌙'];

const RECORD_DATA = {
  심장강화점수: { icon: '❤️', unit: '점', desc: '심박수 구간 기반 환산 점수', D: '32', W: '145', M: '580' },
  걸음수: { icon: '👣', unit: '걸음', desc: '기기를 소지하고 이동한 총 걸음', D: '8,432', W: '54,200', M: '210,500' },
  소모칼로리: { icon: '🔥', unit: 'kcal', desc: '활동 및 러닝 소모 칼로리', D: '420', W: '2,800', M: '11,200' },
  이동거리: { icon: '📍', unit: 'km', desc: 'GPS 기반 총 이동 거리', D: '5.2', W: '32.5', M: '120.4' },
  운동시간: { icon: '⏱️', unit: '분', desc: '순수 러닝/걷기 활성 시간', D: '45', W: '280', M: '1,150' }
};

const LAYER = {
  DROP: 'drop',
  PLACE: 'place',
  RECORD: 'record'
};

function getStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const mapNode = useRef(null);
  const mapRef = useRef(null);
  const markerGroupRef = useRef(null);
  const selectedLatLngRef = useRef(null);
  const layerRef = useRef(LAYER.DROP);
  const isDropModeRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState('');
  const [layer, setLayer] = useState(LAYER.DROP);
  const [isDropMode, setIsDropMode] = useState(false);
  const [drops, setDrops] = useState(() => getStorage('drops', []));
  const [selectedEmoji, setSelectedEmoji] = useState('🏃');
  const [draftText, setDraftText] = useState('');
  const [draftMedia, setDraftMedia] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentMedia, setCommentMedia] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [activeContext, setActiveContext] = useState(null);
  const [recordKey, setRecordKey] = useState('심장강화점수');
  const [recordPeriod, setRecordPeriod] = useState('D');
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    layerRef.current = layer;
  }, [layer]);

  useEffect(() => {
    isDropModeRef.current = isDropMode;
  }, [isDropMode]);

  useEffect(() => {
    if (!mapNode.current || mapRef.current) return;

    try {
      if (mapNode.current._leaflet_id) {
        mapNode.current._leaflet_id = null;
      }

      const map = L.map(mapNode.current, { zoomControl: false }).setView([37.5271, 126.9326], 15);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);
      const group = L.layerGroup().addTo(map);

      mapRef.current = map;
      markerGroupRef.current = group;
      setMapReady(true);
      setMapError('');

      map.on('click', (event) => {
        if (!isDropModeRef.current || layerRef.current !== LAYER.DROP) return;
        selectedLatLngRef.current = event.latlng;
        setIsDropMode(false);
        setActiveModal('create');
      });

      return () => {
        map.remove();
        mapRef.current = null;
        markerGroupRef.current = null;
        setMapReady(false);
      };
    } catch (error) {
      setMapError('지도를 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('drops', JSON.stringify(drops));
  }, [drops]);

  useEffect(() => {
    const now = Date.now();
    const validDrops = drops.filter((drop) => now - drop.createdAt < 15 * 60 * 1000);
    if (validDrops.length !== drops.length) setDrops(validDrops);
  }, [drops]);

  useEffect(() => {
    if (!mapRef.current || !markerGroupRef.current) return;
    markerGroupRef.current.clearLayers();

    if (layer === LAYER.DROP) {
      drops.forEach((drop) => {
        const icon = L.divIcon({
          className: 'emoji-pin-wrapper',
          html: `<div class="emoji-pin">${drop.emoji}</div>`,
          iconSize: [44, 44]
        });
        const marker = L.marker([drop.lat, drop.lng], { icon });
        marker.on('click', () => {
          setActiveContext({ type: 'drop', id: drop.id, data: drop });
          setActiveModal('detail');
        });
        marker.addTo(markerGroupRef.current);
      });
      return;
    }

    if (layer === LAYER.PLACE) {
      SPOTS.forEach((spot) => {
        const icon = L.divIcon({
          className: 'emoji-pin-wrapper',
          html: `<div class="emoji-pin">${spot.emoji}</div>`,
          iconSize: [44, 44]
        });
        const marker = L.marker([spot.lat, spot.lng], { icon });
        marker.on('click', () => {
          setActiveContext({
            type: 'place',
            id: spot.id,
            data: { text: spot.name, emoji: spot.emoji, createdAt: Date.now() }
          });
          setActiveModal('detail');
        });
        marker.addTo(markerGroupRef.current);
      });
    }
  }, [layer, drops]);

  useEffect(() => {
    if (!activeContext || activeContext.type !== 'drop') {
      setRemaining('');
      return;
    }

    const tick = () => {
      const rem = Math.max(0, 15 * 60 - Math.floor((Date.now() - activeContext.data.createdAt) / 1000));
      setRemaining(`⏳ ${Math.floor(rem / 60)}:${String(rem % 60).padStart(2, '0')} 남음`);
      if (rem === 0) {
        setActiveModal(null);
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [activeContext]);

  const comments = activeContext ? getStorage(`comments_${activeContext.type}_${activeContext.id}`, []) : [];

  const record = RECORD_DATA[recordKey];

  function closeModal() {
    setActiveModal(null);
    setDraftMedia(null);
    setCommentMedia(null);
  }

  function toggleDrop() {
    if (layer !== LAYER.DROP) setLayer(LAYER.DROP);
    setIsDropMode((prev) => !prev);
  }

  function submitDrop() {
    if (!selectedLatLngRef.current || (!draftText.trim() && !draftMedia)) return;
    const next = {
      id: Date.now(),
      lat: selectedLatLngRef.current.lat,
      lng: selectedLatLngRef.current.lng,
      emoji: selectedEmoji,
      text: draftText.trim(),
      createdAt: Date.now(),
      media: draftMedia
    };
    setDrops((prev) => [...prev, next]);
    setDraftText('');
    setDraftMedia(null);
    closeModal();
  }

  function submitComment() {
    if (!activeContext || (!commentText.trim() && !commentMedia)) return;
    const key = `comments_${activeContext.type}_${activeContext.id}`;
    const prev = getStorage(key, []);
    const next = [...prev, { text: commentText.trim(), media: commentMedia, time: Date.now() }];
    localStorage.setItem(key, JSON.stringify(next));
    setCommentText('');
    setCommentMedia(null);
    setActiveModal('detail');
  }

  function onFileUpload(event, target) {
    const file = event.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    if (target === 'create') setDraftMedia({ url: objectUrl });
    if (target === 'comment') setCommentMedia({ url: objectUrl });
  }

  function recordPeriodText(period) {
    if (period === 'D') return '오늘 하루';
    if (period === 'W') return '이번 주';
    return '이번 달';
  }

  return (
    <div className="desktop-bg">
      <div className="app-shell">
        <aside className="summary-panel">
          <h1>RUN DROP</h1>
          <p>한강 러닝 바이브와 스팟 기록을 실시간으로 공유하세요.</p>
          <div className="summary-card">
            <span>오늘 러너 드롭</span>
            <strong>{drops.length}개</strong>
          </div>
          <div className="summary-card">
            <span>레이어</span>
            <strong>{layer === 'drop' ? '실시간 러너' : layer === 'place' ? '주변 스팟' : '내 기록'}</strong>
          </div>
        </aside>

        <main className="phone-stage">
          <div className="layer-toggle-wrap">
            <button className={`layer-btn ${layer === 'drop' ? 'active' : ''}`} onClick={() => { setLayer(LAYER.DROP); setIsDropMode(false); }}>
              🏃 실시간 러너
            </button>
            <button className={`layer-btn ${layer === 'place' ? 'active' : ''}`} onClick={() => { setLayer(LAYER.PLACE); setIsDropMode(false); }}>
              💧 주변 스팟
            </button>
            <button className={`layer-btn ${layer === 'record' ? 'active' : ''}`} onClick={() => { setLayer(LAYER.RECORD); setIsDropMode(false); }}>
              📊 내 기록
            </button>
          </div>

          {isDropMode && layer === LAYER.DROP && <div className="guide-msg">📍 지도를 클릭하여 위치를 남기세요</div>}

          <div ref={mapNode} className={`map ${layer === LAYER.RECORD ? 'hidden' : ''}`} />
          {!mapReady && !mapError && layer !== LAYER.RECORD && (
            <div className="map-fallback">지도를 준비 중입니다...</div>
          )}
          {mapError && layer !== LAYER.RECORD && <div className="map-fallback error">{mapError}</div>}

          <section className={`record-view ${layer === LAYER.RECORD ? 'active' : ''}`}>
            <h2>오늘의 러닝 요약</h2>
            <div className="record-main-grid">
              <button className="record-card main" onClick={() => { setRecordKey('심장강화점수'); setRecordPeriod('D'); setActiveModal('record'); }}>
                <div className="title">❤️ 심장강화점수</div>
                <div className="value">32<span>점</span></div>
              </button>
              <button className="record-card main" onClick={() => { setRecordKey('걸음수'); setRecordPeriod('D'); setActiveModal('record'); }}>
                <div className="title">👣 걸음수</div>
                <div className="value">8,432<span>걸음</span></div>
              </button>
            </div>
            <div className="record-sub-grid">
              {['소모칼로리', '이동거리', '운동시간'].map((key) => (
                <button key={key} className="record-card" onClick={() => { setRecordKey(key); setRecordPeriod('D'); setActiveModal('record'); }}>
                  <div className="title">{RECORD_DATA[key].icon} {key}</div>
                  <div className="value">{RECORD_DATA[key].D}<span>{RECORD_DATA[key].unit}</span></div>
                </button>
              ))}
            </div>
            <div className="goal-box">
              <div className="medal">🏅</div>
              <strong>훌륭한 페이스입니다!</strong>
              <p>이번 주 목표 달성까지 2km 남았어요.</p>
            </div>
          </section>

          {layer === LAYER.DROP && (
            <button className={`fab-drop ${isDropMode ? 'cancel' : ''}`} onClick={toggleDrop} aria-label="drop">
              <span />
            </button>
          )}
        </main>

        {activeModal && <div className="overlay" onClick={closeModal} />}

        {activeModal === 'create' && (
          <section className="sheet create-sheet">
            <header>
              <h3>지금 나의 러닝 바이브</h3>
            </header>
            <div className="emoji-picker">
              {EMOJIS.map((emoji) => (
                <button key={emoji} className={`emoji-option ${selectedEmoji === emoji ? 'selected' : ''}`} onClick={() => setSelectedEmoji(emoji)}>
                  {emoji}
                </button>
              ))}
            </div>

            {draftMedia?.url && (
              <div className="media-preview-wrap">
                <img src={draftMedia.url} className="media-preview" />
                <button onClick={() => setDraftMedia(null)}>✕</button>
              </div>
            )}

            <div className="chat-input-wrap">
              <label className={`media-btn ${draftMedia ? 'has-file' : ''}`}>
                📷
                <input type="file" accept="image/*" onChange={(event) => onFileUpload(event, 'create')} />
              </label>
              <div className="input-pill">
                <input value={draftText} maxLength={20} onChange={(event) => setDraftText(event.target.value)} placeholder="오늘 러닝 어때요?" />
                <button onClick={submitDrop}>➤</button>
              </div>
            </div>
          </section>
        )}

        {activeModal === 'detail' && activeContext && (
          <section className="sheet detail-sheet">
            <header className="detail-head">
              <div className="emoji">{activeContext.data.emoji}</div>
              <div>
                <h3>{activeContext.data.text}</h3>
                <p className={activeContext.type === 'drop' ? 'warn' : ''}>
                  {activeContext.type === 'drop' ? remaining : '러닝 코스의 고정 스팟입니다.'}
                </p>
              </div>
            </header>

            <div className="feed-list">
              {activeContext.data.media?.url && <img className="feed-media" src={activeContext.data.media.url} />}
              {comments.length === 0 && <div className="empty">가장 먼저 흔적을 남겨보세요!</div>}
              {comments.map((item) => (
                <article key={item.time} className="feed-item">
                  <div className="feed-header">익명 러너</div>
                  <p>{item.text}</p>
                  {item.media?.url && <img className="feed-media" src={item.media.url} />}
                </article>
              ))}
            </div>

            {commentMedia?.url && (
              <div className="media-preview-wrap">
                <img src={commentMedia.url} className="media-preview" />
                <button onClick={() => setCommentMedia(null)}>✕</button>
              </div>
            )}

            <div className="chat-input-wrap">
              <label className={`media-btn ${commentMedia ? 'has-file' : ''}`}>
                📷
                <input type="file" accept="image/*" onChange={(event) => onFileUpload(event, 'comment')} />
              </label>
              <div className="input-pill">
                <input value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="스팟에 흔적 남기기..." />
                <button onClick={submitComment}>➤</button>
              </div>
            </div>
          </section>
        )}

        {activeModal === 'record' && (
          <section className="sheet record-sheet">
            <header className="detail-head">
              <div className="emoji">{record.icon}</div>
              <div>
                <h3>{recordKey}</h3>
                <p>{record.desc}</p>
              </div>
            </header>

            <div className="stat-tabs">
              {['D', 'W', 'M'].map((period) => (
                <button key={period} className={recordPeriod === period ? 'active' : ''} onClick={() => setRecordPeriod(period)}>
                  {period === 'D' ? '일간' : period === 'W' ? '주간' : '월간'}
                </button>
              ))}
            </div>

            <div className="stat-box">
              <strong>{record[recordPeriod]}</strong>
              <span>{record.unit}</span>
              <p>{recordPeriodText(recordPeriod)} 누적 기록입니다.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
