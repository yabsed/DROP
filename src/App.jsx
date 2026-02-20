import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Modal, Button, ActionIcon, Text, Alert, Center, Loader, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Map } from './components/Map';
import { LayerToggle } from './components/LayerToggle/LayerToggle';
import { RecordView } from './components/RecordView/RecordView';
import { CreateDropModal } from './components/Modals/CreateDropModal';
import { DetailModal } from './components/Modals/DetailModal';
import { RecordModal } from './components/Modals/RecordModal';
import { LAYER } from './constants/data';
import { getStorage } from './utils/storage';

export default function App() {
  const selectedLatLngRef = useRef(null);
  
  // existing state
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
    localStorage.setItem('drops', JSON.stringify(drops));
  }, [drops]);

  useEffect(() => {
    const now = Date.now();
    const validDrops = drops.filter((drop) => now - drop.createdAt < 15 * 60 * 1000);
    if (validDrops.length !== drops.length) setDrops(validDrops);
  }, [drops]);

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

  function closeModal() {
    setActiveModal(null);
    setDraftMedia(null);
    setCommentMedia(null);
  }

  function toggleDrop() {
    if (layer !== LAYER.DROP) setLayer(LAYER.DROP);
    setIsDropMode((prev) => !prev);
  }

  function onMapClick(latlng) {
    selectedLatLngRef.current = latlng;
    setIsDropMode(false);
    setActiveModal('create');
  }

  function onMarkerClick(context) {
    setActiveContext(context);
    setActiveModal('detail');
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
    setActiveContext({...activeContext}); 
  }

  function onFileUpload(event, target) {
    const file = event.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    if (target === 'create') setDraftMedia({ url: objectUrl });
    if (target === 'comment') setCommentMedia({ url: objectUrl });
  }

  return (
    <Box h="100vh" w="100vw" pos="relative" bg="white" style={{ overflow: 'hidden' }}>
      <LayerToggle layer={layer} setLayer={setLayer} setIsDropMode={setIsDropMode} />

      {isDropMode && layer === LAYER.DROP && (
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

        <Map
          layer={layer}
          isDropMode={isDropMode}
          drops={drops}
          onMapClick={onMapClick}
          onMarkerClick={onMarkerClick}
          setMapReady={setMapReady}
          setMapError={setMapError}
        />
        
        {!mapReady && !mapError && layer !== LAYER.RECORD && (
          <Center pos="absolute" top={0} left={0} w="100%" h="100%" bg="white" style={{ zIndex: 5 }}>
            <Loader size="lg" />
            <Text ml="md">지도를 준비 중입니다...</Text>
          </Center>
        )}
        {mapError && layer !== LAYER.RECORD && (
          <Center pos="absolute" top={0} left={0} w="100%" h="100%" bg="white" style={{ zIndex: 5 }}>
             <Text c="red">{mapError}</Text>
          </Center>
        )}

        <RecordView
          layer={layer}
          setRecordKey={setRecordKey}
          setRecordPeriod={setRecordPeriod}
          setActiveModal={setActiveModal}
        />

        {layer === LAYER.DROP && (
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
        )}

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

        <Modal opened={activeModal === 'detail' && !!activeContext} onClose={closeModal} withCloseButton={false} centered padding={0}>
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

        <Modal opened={activeModal === 'record'} onClose={closeModal} withCloseButton={false} centered padding={0}>
          <RecordModal
            recordKey={recordKey}
            recordPeriod={recordPeriod}
            setRecordPeriod={setRecordPeriod}
          />
        </Modal>
    </Box>
  );
}
