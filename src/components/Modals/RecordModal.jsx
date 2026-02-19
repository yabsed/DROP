import React from 'react';
import { RECORD_DATA } from '../../constants/data';

export function RecordModal({ recordKey, recordPeriod, setRecordPeriod }) {
  const record = RECORD_DATA[recordKey];

  function recordPeriodText(period) {
    if (period === 'D') return '오늘 하루';
    if (period === 'W') return '이번 주';
    return '이번 달';
  }

  return (
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
  );
}
