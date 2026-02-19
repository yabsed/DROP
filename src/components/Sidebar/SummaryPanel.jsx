import React from 'react';
import { LAYER } from '../../constants/data';

export function SummaryPanel({ dropsCount, layer }) {
  return (
    <aside className="summary-panel">
      <h1>RUN DROP</h1>
      <p>한강 러닝 바이브와 스팟 기록을 실시간으로 공유하세요.</p>
      <div className="summary-card">
        <span>오늘 러너 드롭</span>
        <strong>{dropsCount}개</strong>
      </div>
      <div className="summary-card">
        <span>레이어</span>
        <strong>{layer === LAYER.DROP ? '실시간 러너' : layer === LAYER.PLACE ? '주변 스팟' : '내 기록'}</strong>
      </div>
    </aside>
  );
}
