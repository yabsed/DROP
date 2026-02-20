import React from 'react';
import { Box, SimpleGrid, Title, Text, UnstyledButton, Group, ThemeIcon, Stack, Paper } from '@mantine/core';
import { LAYER, RECORD_DATA } from '../../constants/data';

export function RecordView({ layer, setRecordKey, setRecordPeriod, setActiveModal }) {
  return (
    <Box
      pos="absolute"
      bottom={0}
      left={0}
      w="100%"
      h="85%"
      bg="gray.0"
      p="lg"
      style={{
        transform: layer === LAYER.RECORD ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 1100,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
      }}
    >
      <Title order={3} mb="lg">오늘의 러닝 요약</Title>

      <SimpleGrid cols={2} spacing="md" mb="md">
        <Paper
          component={UnstyledButton}
          p="md"
          radius="md"
          withBorder
          onClick={() => { setRecordKey('심장강화점수'); setRecordPeriod('D'); setActiveModal('record'); }}
          bg="white"
        >
          <Text size="sm" c="dimmed" mb={4}>❤️ 심장강화점수</Text>
          <Group align="flex-end" gap={4}>
            <Text fz={28} fw={700} lh={1}>32</Text>
            <Text size="sm" c="dimmed" mb={4}>점</Text>
          </Group>
        </Paper>

        <Paper
          component={UnstyledButton}
          p="md"
          radius="md"
          withBorder
          onClick={() => { setRecordKey('걸음수'); setRecordPeriod('D'); setActiveModal('record'); }}
          bg="white"
        >
          <Text size="sm" c="dimmed" mb={4}>👣 걸음수</Text>
          <Group align="flex-end" gap={4}>
            <Text fz={28} fw={700} lh={1}>8,432</Text>
            <Text size="sm" c="dimmed" mb={4}>걸음</Text>
          </Group>
        </Paper>
      </SimpleGrid>

      <SimpleGrid cols={3} spacing="sm" mb="xl">
        {['소모칼로리', '이동거리', '운동시간'].map((key) => (
          <Paper
            key={key}
            component={UnstyledButton}
            p="sm"
            radius="md"
            withBorder
            onClick={() => { setRecordKey(key); setRecordPeriod('D'); setActiveModal('record'); }}
            bg="white"
          >
            <Text size="xs" c="dimmed" mb={4} truncate>
                {RECORD_DATA[key].icon} {key}
            </Text>
            <Group align="flex-end" gap={2}>
              <Text fw={700} fz="lg" lh={1}>{RECORD_DATA[key].D}</Text>
              <Text size="xs" c="dimmed" mb={2}>{RECORD_DATA[key].unit}</Text>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>

      <Paper p="lg" radius="md" bg="blue.0" withBorder style={{ borderColor: 'var(--mantine-color-blue-2)' }}>
        <Group>
          <ThemeIcon size="xl" radius="xl" variant="white" color="blue">
            🏅
          </ThemeIcon>
          <Stack gap={0}>
            <Text fw={700} c="blue.9">훌륭한 페이스입니다!</Text>
            <Text size="sm" c="blue.7">이번 주 목표 달성까지 2km 남았어요.</Text>
          </Stack>
        </Group>
      </Paper>
    </Box>
  );
}
