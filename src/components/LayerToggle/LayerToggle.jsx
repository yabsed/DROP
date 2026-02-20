import React from 'react';
import { SegmentedControl, Box } from '@mantine/core';
import { LAYER } from '../../constants/data';

export function LayerToggle({ layer, setLayer, setIsDropMode }) {
  return (
    <Box pos="absolute" top={20} left="50%" style={{ transform: 'translateX(-50%)', zIndex: 1200 }}>
      <SegmentedControl
        value={layer}
        onChange={(value) => {
          setLayer(value);
          setIsDropMode(false);
        }}
        radius="xl"
        size="sm"
        data={[
          { label: '🏃 실시간 러너', value: LAYER.DROP },
          { label: '💧 주변 스팟', value: LAYER.PLACE },
          { label: '📊 내 기록', value: LAYER.RECORD },
        ]}
        styles={{
          root: { backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)' }
        }}
      />
    </Box>
  );
}
