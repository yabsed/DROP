import React from 'react';
import { ActionIcon, Modal, Alert } from '@mantine/core';
import { CreateDropModal } from './CreateDropModal';
import { DetailModal } from '../../components/Modals/DetailModal';

export function RunnerManager({ 
  layer, 
  isDropMode, 
  toggleDrop, 
  activeModal, 
  closeModal,
  selectedEmoji, 
  setSelectedEmoji, 
  draftMedia, 
  setDraftMedia, 
  draftText, 
  setDraftText, 
  onFileUpload, 
  submitDrop,
  activeContext,
  remaining,
  comments,
  commentMedia,
  setCommentMedia,
  commentText,
  setCommentText,
  submitComment
}) {
  if (layer !== 'drop') return null;

  return (
    <>
      {isDropMode && (
        <Alert 
          color="blue" 
          variant="light" 
          pos="absolute" 
          top={70} 
          left="50%" 
          style={{ transform: 'translateX(-50%)', zIndex: 1000, whiteSpace: 'nowrap' }}
        >
          📍 지도를 클릭하여 위치를 남기세요
        </Alert>
      )}

      <ActionIcon 
        variant="filled" 
        color={isDropMode ? "red" : "blue"} 
        size={56} 
        radius="xl" 
        pos="absolute" 
        bottom={30} 
        right={20} 
        onClick={toggleDrop} 
        aria-label="drop"
        style={{ zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
      >
        <span style={{ fontSize: 24 }}>{isDropMode ? '✕' : '+'}</span>
      </ActionIcon>

      <Modal opened={activeModal === 'create'} onClose={closeModal} withCloseButton={false} centered padding={0}>
        <CreateDropModal
          selectedEmoji={selectedEmoji}
          setSelectedEmoji={setSelectedEmoji}
          draftMedia={draftMedia}
          setDraftMedia={setDraftMedia}
          draftText={draftText}
          setDraftText={setDraftText}
          onFileUpload={onFileUpload}
          submitDrop={submitDrop}
        />
      </Modal>

      {/* DetailModal is shared but used differently per feature logic? 
          Actually DetailModal logic is conditioned on activeContext.type 
          If type is 'drop', it usually falls under Runner feature.
      */}
      <Modal opened={activeModal === 'detail' && activeContext?.type === 'drop'} onClose={closeModal} withCloseButton={false} centered padding={0}>
        {activeContext && (
          <DetailModal
            activeContext={activeContext}
            remaining={remaining}
            comments={comments}
            commentMedia={commentMedia}
            setCommentMedia={setCommentMedia}
            commentText={commentText}
            setCommentText={setCommentText}
            onFileUpload={onFileUpload}
            submitComment={submitComment}
          />
        )}
      </Modal>
    </>
  );
}
