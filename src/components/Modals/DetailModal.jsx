import React from 'react';
import { Stack, Group, Avatar, Title, Text, ScrollArea, Card, Image, Box, TextInput, FileButton, ActionIcon } from '@mantine/core';

export function DetailModal({ activeContext, remaining, comments, commentMedia, setCommentMedia, commentText, setCommentText, onFileUpload, submitComment }) {
  return (
    <Stack h="100%" gap="md" p="md">
      <Group>
        <Avatar size="xl" radius="xl" color="blue" variant="light">
          {activeContext.data.emoji || '📍'}
        </Avatar>
        <Stack gap={0}>
          <Title order={4}>{activeContext.data.text || 'Unknown Spot'}</Title>
          <Text c={activeContext.type === 'drop' ? 'red' : 'dimmed'} size="sm">
            {activeContext.type === 'drop' ? remaining : '러닝 코스의 고정 스팟입니다.'}
          </Text>
        </Stack>
      </Group>

      <ScrollArea style={{ flex: 1, minHeight: 100, maxHeight: '40vh' }} offsetScrollbars scrollbarSize={6}>
        {activeContext.data.media?.url && (
            <Image src={activeContext.data.media.url} radius="md" mb="sm" alt="Feed" />
        )}
        
        {comments.length === 0 && !activeContext.data.media?.url && (
            <Text c="dimmed" ta="center" py="xl">가장 먼저 흔적을 남겨보세요!</Text>
        )}
        
        <Stack gap="sm">
            {comments.map((item) => (
            <Card key={item.time} withBorder padding="sm" radius="md">
                <Text size="xs" fw={700} c="dimmed" mb={4}>익명 러너</Text>
                <Text size="sm">{item.text}</Text>
                {item.media?.url && (
                    <Image src={item.media.url} radius="sm" mt="xs" />
                )}
            </Card>
            ))}
        </Stack>
      </ScrollArea>

      <Card withBorder padding="sm" radius="md" bg="gray.0">
        {commentMedia?.url && (
            <Box pos="relative" mb="sm">
                <Image src={commentMedia.url} radius="md" mah={100} style={{ objectFit: 'cover' }} />
                <ActionIcon 
                    variant="filled" 
                    color="dark" 
                    size="xs" 
                    radius="xl" 
                    pos="absolute" 
                    top={5} 
                    right={5}
                    onClick={() => setCommentMedia(null)}
                >
                    ✕
                </ActionIcon>
            </Box>
        )}

        <Group gap="xs" align="center">
          <FileButton onChange={(file) => onFileUpload({ target: { files: [file] } }, 'comment')} accept="image/*">
            {(props) => (
              <ActionIcon {...props} variant={commentMedia ? 'filled' : 'light'} color="blue" size="lg" radius="xl">
                📷
              </ActionIcon>
            )}
          </FileButton>
          
          <TextInput
            placeholder="스팟에 흔적 남기기..."
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            style={{ flex: 1 }}
            radius="xl"
            rightSection={
                <ActionIcon variant="transparent" color="blue" onClick={submitComment} disabled={!commentText && !commentMedia}>
                    ➤
                </ActionIcon>
            }
          />
        </Group>
      </Card>
    </Stack>
  );
}
