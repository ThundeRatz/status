export const sites = [
  {
    id: 'thunderatz-org',
    name: 'thunderatz.org',
    matchName: 'thunderatz.org/',
    easterEggs: {
      down: ['Deve ter caido um raio', 'Ate o site caiu'],
      up: ['Inabalavel', 'Quero ver derrubar'],
    },
  },
  {
    id: 'forum',
    name: 'Forum',
    matchName: 'rum',
    easterEggs: {
      down: ['Ninguem postava mesmo...', 'Era so spam de qualquer jeito'],
      up: ['Se cair tb fudeu'],
    },
  },
  {
    id: 'drive',
    name: 'Drive',
    matchName: 'Drive',
    easterEggs: {
      down: [
        'Quem diria...',
        'De novo?',
        'Surpreendente (nao)',
        'Classico',
        'Dia normal',
        'Pelo menos eh consistente',
      ],
      up: [
        'Aproveita enquanto dura',
        'Historico!',
        'Nao vai durar',
        'Screenshot isso',
        'Marca no calendario',
      ],
    },
  },
]

export const findSiteConfig = (serviceName) => {
  return sites.find((site) =>
    serviceName.toLowerCase().includes(site.matchName.toLowerCase())
  )
}
