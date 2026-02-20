import React from 'react';
import { Modal } from '@mantine/core';
import { DetailModal } from '../../components/Modals/DetailModal';

export function SpotManager({ activeModal, activeContext, closeModal, remaining, comments, commentMedia, setCommentMedia, commentText, setCommentText, onFileUpload, submitComment }) {
  // Only render if activeContext.type is 'place'
  // But also needs access to `comments`, `DetailModal` props.

  return (
    <Modal opened={activeModal === 'detail' && activeContext?.type === 'place'} onClose={closeModal} withCloseButton={false} centered padding={0}>
        {activeContext && (
          <DetailModal
            activeContext={activeContext}
            remaining={remaining} // Maybe not needed for places?
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
  );
}
