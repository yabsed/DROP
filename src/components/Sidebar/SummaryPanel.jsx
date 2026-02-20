import React from 'react';
import { Paper, Title, Text, Group } from '@mantine/core';
import { LAYER } from '../../constants/data';

export function SummaryPanel({ dropsCount, layer }) {
  return (
    <Paper 
        p="xl" 
        radius="lg" 
        withBorder 
        shadow="md" 
        bg="rgba(255, 255, 255, 0.78)" 
        style={{ backdropFilter: 'blur(12px)' }}
    >
      <Title order={2} mb="xs">RUN DROP</Title>
      <Text c="dimmed" size="sm" mb="xl">
        한강 러닝 바이브와 스팟 기록을 실시간으로 공유하세요.
      </Text>
      
      <Paper withBorder p="md" radius="md" mb="sm" bg="white">
        <Group justify="space-between">
            <Text size="xs" fw={700} c="dimmed">오늘 러너 드롭</Text>
            <Text size="lg" fw={700}>{dropsCount}개</Text>
        </Group>
      </Paper>

      <Paper withBorder p="md" radius="md" bg="white">
        <Group justify="space-between">
            <Text size="xs" fw={700} c="dimmed">레이어</Text>
            <Text size="lg" fw={700}>
                {layer === LAYER.DROP ? '실시간 러너' : layer === LAYER.PLACE ? '주변 스팟' : '내 기록'}
            </Text>
        </Group>
      </Paper>
    </Paper>
  );
}
