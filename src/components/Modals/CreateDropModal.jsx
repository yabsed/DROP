import React from 'react';
import { EMOJIS } from '../../constants/data';

export function CreateDropModal({ selectedEmoji, setSelectedEmoji, draftMedia, setDraftMedia, draftText, setDraftText, onFileUpload, submitDrop }) {
  return (
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

      <div className="compose-card">
        {draftMedia?.url && (
          <div className="media-preview-wrap">
            <img src={draftMedia.url} className="media-preview" alt="Preview" />
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
      </div>
    </section>
  );
}
