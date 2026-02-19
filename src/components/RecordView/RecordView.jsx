import React from 'react';
import { LAYER, RECORD_DATA } from '../../constants/data';

export function RecordView({ layer, setRecordKey, setRecordPeriod, setActiveModal }) {
  return (
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
  );
}
