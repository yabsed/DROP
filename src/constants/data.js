export const SPOTS = [
  { id: 'spot_1', name: '여의도 물빛광장 편의점', lat: 37.5271, lng: 126.9326, emoji: '🏪' },
  { id: 'spot_2', name: '반포 달빛무지개분수 화장실', lat: 37.5105, lng: 126.996, emoji: '🚻' },
  { id: 'spot_3', name: '잠수교 남단 식수대', lat: 37.5135, lng: 126.9955, emoji: '🚰' },
  { id: 'spot_4', name: '마포대교 아래 쉼터 벤치', lat: 37.5332, lng: 126.9368, emoji: '🪑' },
  { id: 'spot_5', name: '여의나루역 짐보관소', lat: 37.527, lng: 126.932, emoji: '🎒' }
];

export const EMOJIS = ['🏃', '🔥', '💦', '⏱️', '🎧', '📸', '🏅', '👟', '🐶', '🚴', '🌙'];

export const RECORD_DATA = {
  심장강화점수: { icon: '❤️', unit: '점', desc: '심박수 구간 기반 환산 점수', D: '32', W: '145', M: '580' },
  걸음수: { icon: '👣', unit: '걸음', desc: '기기를 소지하고 이동한 총 걸음', D: '8,432', W: '54,200', M: '210,500' },
  소모칼로리: { icon: '🔥', unit: 'kcal', desc: '활동 및 러닝 소모 칼로리', D: '420', W: '2,800', M: '11,200' },
  이동거리: { icon: '📍', unit: 'km', desc: 'GPS 기반 총 이동 거리', D: '5.2', W: '32.5', M: '120.4' },
  운동시간: { icon: '⏱️', unit: '분', desc: '순수 러닝/걷기 활성 시간', D: '45', W: '280', M: '1,150' }
};

export const LAYER = {
  DROP: 'drop',
  PLACE: 'place',
  RECORD: 'record'
};
