import React from 'react';
import { Stack, Title, SimpleGrid, ActionIcon, Card, Image, Group, TextInput, FileButton, Box } from '@mantine/core';
import { EMOJIS } from '../../utils/data';

export function CreateDropModal({ selectedEmoji, setSelectedEmoji, draftMedia, setDraftMedia, draftText, setDraftText, onFileUpload, submitDrop }) {
  return (
    <Stack p="md" gap="lg">
      <Title order={3} ta="center" fz="lg">지금 나의 러닝 바이브</Title>
      
      <SimpleGrid cols={5} spacing="xs">
        {EMOJIS.map((emoji) => (
          <ActionIcon
            key={emoji}
            variant={selectedEmoji === emoji ? 'filled' : 'default'}
            color={selectedEmoji === emoji ? 'blue' : 'gray'}
            onClick={() => setSelectedEmoji(emoji)}
            size="xl"
            radius="xl"
            style={{ fontSize: '1.5rem', height: '3.5rem', width: '3.5rem' }}
          >
            {emoji}
          </ActionIcon>
        ))}
      </SimpleGrid>

      <Card withBorder padding="sm" radius="md" bg="gray.0">
        {draftMedia?.url && (
            <Box pos="relative" mb="sm">
                <Image src={draftMedia.url} radius="md" />
                <ActionIcon 
                    variant="filled" 
                    color="dark" 
                    size="sm" 
                    radius="xl" 
                    pos="absolute" 
                    top={5} 
                    right={5}
                    onClick={() => setDraftMedia(null)}
                >
                    ✕
                </ActionIcon>
            </Box>
        )}

        <Group gap="xs" align="center">
          <FileButton onChange={(file) => onFileUpload({ target: { files: [file] } }, 'create')} accept="image/*">
            {(props) => (
              <ActionIcon {...props} variant={draftMedia ? 'filled' : 'light'} color="blue" size="lg" radius="xl">
                📷
              </ActionIcon>
            )}
          </FileButton>
          
          <TextInput
            placeholder="오늘 러닝 어때요?"
            value={draftText}
            onChange={(event) => setDraftText(event.target.value)}
            maxLength={20}
            style={{ flex: 1 }}
            radius="xl"
            rightSection={
                <ActionIcon variant="transparent" color="blue" onClick={submitDrop} disabled={!draftText && !draftMedia}>
                    ➤
                </ActionIcon>
            }
          />
        </Group>
      </Card>
    </Stack>
  );
}
