export const pickWeighted = (options) => {
  if (!options || options.length === 0) return null

  const totalWeight = options.reduce((sum, opt) => sum + (opt.weight || 1), 0)
  let random = Math.random() * totalWeight

  for (const option of options) {
    random -= option.weight || 1
    if (random <= 0) {
      return option
    }
  }

  return options[options.length - 1]
}

export const pickRandom = (array) => {
  if (!array || array.length === 0) return null
  return array[Math.floor(Math.random() * array.length)]
}

export const shouldShow = (chance) => {
  if (chance === undefined || chance === null) return true
  return Math.random() < chance
}

export const getEasterEgg = (easterEggs, status) => {
  if (!easterEggs) return null

  const statusKey = status === 'up' ? 'up' : 'down'
  const config = easterEggs[statusKey]

  if (!config) return null

  if (Array.isArray(config)) {
    return pickRandom(config)
  }

  if (config.messages && shouldShow(config.chance)) {
    return pickRandom(config.messages)
  }

  return null
}
