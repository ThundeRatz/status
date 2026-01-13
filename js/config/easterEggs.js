export const globalEasterEggs = {
  titles: {
    allUp: [
      'Todos os sistemas operacionais',
      'Tudo no ar (por enquanto)',
      'Surpreendentemente estavel',
      'All Systems Operational',
    ],
    someDown: [
      'Parcialmente funcional',
      'Poderia ser pior',
      'Dia normal na Thunder',
      'Partial Outage',
    ],
    allDown: [
      'F',
      'Desligaram a Gaiola?',
      'Alguem tropecou no cabo',
      'Major Outage',
    ],
  },

  lastUpdated: [
    'Atualizado ha {time}',
    'Ultima checagem: {time} atras',
    'Verificado ha {time} (provavelmente)',
  ],

  footer: [
    'ThundeRatz - Desde 2001 quebrando robos',
    'Se quebrar, a culpa nao eh minha',
    'Funciona na minha maquina',
  ],

  secrets: {
    konamiCode: 'Voce encontrou o easter egg! Agora vai estudar',
    clickTitle5x: 'Parabens, voce quebrou mais uma coisa',
  },
}

export const getRandomTitle = (status) => {
  const titles = globalEasterEggs.titles[status] || globalEasterEggs.titles.allUp
  return titles[Math.floor(Math.random() * titles.length)]
}

export const getRandomFooter = () => {
  const footers = globalEasterEggs.footer
  return footers[Math.floor(Math.random() * footers.length)]
}

export const getRandomLastUpdated = () => {
  const templates = globalEasterEggs.lastUpdated
  return templates[Math.floor(Math.random() * templates.length)]
}
