export const customs = [
  {
    id: 'ktorze',
    name: 'K-Torze',
    states: [
      { status: 'up', message: 'Descapotando', weight: 85 },
      { status: 'degraded', message: 'Pneu furado', weight: 10 },
      { status: 'down', message: 'Capotou', weight: 5 },
    ],
  },
  {
    id: 'galena',
    name: 'Galena',
    states: [
      { status: 'up', message: 'Fazendo estrela', weight: 80 },
      { status: 'degraded', message: 'Meio tonta', weight: 12 },
      { status: 'down', message: 'Caiu da estrela', weight: 8 },
    ],
  },
  {
    id: 'thor',
    name: 'Thor',
    states: [
      { status: 'up', message: 'Na Gaiola', weight: 95 },
      { status: 'degraded', message: 'Na casa do Arttie', weight: 5 },
    ],
  },
  {
    id: 'stonehenge',
    name: 'Stonehenge',
    states: [
      { status: 'up', message: '11x Campeao', weight: 100 },
    ],
  },
]
