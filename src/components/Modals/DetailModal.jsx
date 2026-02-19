import React from 'react';

export function DetailModal({ activeContext, remaining, comments, commentMedia, setCommentMedia, commentText, setCommentText, onFileUpload, submitComment }) {
  return (
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
        {activeContext.data.media?.url && <img className="feed-media" src={activeContext.data.media.url} alt="Feed" />}
        {comments.length === 0 && <div className="empty">가장 먼저 흔적을 남겨보세요!</div>}
        {comments.map((item) => (
          <article key={item.time} className="feed-item">
            <div className="feed-header">익명 러너</div>
            <p>{item.text}</p>
            {item.media?.url && <img className="feed-media" src={item.media.url} alt="Comment" />}
          </article>
        ))}
      </div>

      <div className="compose-card">
        {commentMedia?.url && (
          <div className="media-preview-wrap">
            <img src={commentMedia.url} className="media-preview" alt="Preview" />
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
      </div>
    </section>
  );
}
