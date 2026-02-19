import React from 'react';
import { LAYER } from '../../constants/data';

export function LayerToggle({ layer, setLayer, setIsDropMode }) {
  return (
    <div className="layer-toggle-wrap">
      <button className={`layer-btn ${layer === LAYER.DROP ? 'active' : ''}`} onClick={() => { setLayer(LAYER.DROP); setIsDropMode(false); }}>
        🏃 실시간 러너
      </button>
      <button className={`layer-btn ${layer === LAYER.PLACE ? 'active' : ''}`} onClick={() => { setLayer(LAYER.PLACE); setIsDropMode(false); }}>
        💧 주변 스팟
      </button>
      <button className={`layer-btn ${layer === LAYER.RECORD ? 'active' : ''}`} onClick={() => { setLayer(LAYER.RECORD); setIsDropMode(false); }}>
        📊 내 기록
      </button>
    </div>
  );
}
