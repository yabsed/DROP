import React from 'react';
import { Stack, Group, Avatar, Title, Text, SegmentedControl, Paper } from '@mantine/core';
import { RECORD_DATA } from '../../utils/data';

export function RecordModal({ recordKey, recordPeriod, setRecordPeriod }) {
  const record = RECORD_DATA[recordKey];

  function recordPeriodText(period) {
    if (period === 'D') return '오늘 하루';
    if (period === 'W') return '이번 주';
    return '이번 달';
  }

  return (
    <Stack gap="lg" p="md">
      <Group>
        <Avatar size="xl" radius="xl" color="indigo" variant="light">
          {record.icon}
        </Avatar>
        <Stack gap={0}>
          <Title order={4}>{recordKey}</Title>
          <Text size="sm" c="dimmed">
            {record.desc}
          </Text>
        </Stack>
      </Group>

      <SegmentedControl
        value={recordPeriod}
        onChange={setRecordPeriod}
        fullWidth
        data={[
          { label: '일간', value: 'D' },
          { label: '주간', value: 'W' },
          { label: '월간', value: 'M' },
        ]}
      />

      <Paper withBorder p="xl" radius="md" bg="gray.0" ta="center">
        <Text fz={40} fw={700} lh={1} c="indigo">
          {record[recordPeriod]}
          <Text span fz="md" fw={500} c="dimmed" ml={4}>
            {record.unit}
          </Text>
        </Text>
        <Text size="sm" c="dimmed" mt="sm">
          {recordPeriodText(recordPeriod)} 누적 기록입니다.
        </Text>
      </Paper>
    </Stack>
  );
}
