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
]

export const findSiteConfig = (serviceName) => {
  return sites.find((site) =>
    serviceName.toLowerCase().includes(site.matchName.toLowerCase())
  )
}
