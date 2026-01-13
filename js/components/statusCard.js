import { getEasterEgg } from '../services/randomizer.js'

const getUptimeColor = (uptime) => {
  if (uptime === null) return 'null'
  if (uptime >= 99) return 'up'
  if (uptime >= 90) return 'degraded'
  return 'down'
}

const createUptimeChart = (dailyHistory) => {
  if (!dailyHistory || dailyHistory.length === 0) return ''

  const last30 = dailyHistory.slice(0, 30).reverse()

  const bars = last30
    .map((uptime, i) => {
      const color = getUptimeColor(uptime)
      const title = uptime !== null ? `Dia ${i + 1}: ${uptime.toFixed(1)}%` : `Dia ${i + 1}: Sem dados`
      return `<div class="uptime-chart__bar" data-uptime="${color}" title="${title}"></div>`
    })
    .join('')

  return `<div class="uptime-chart">${bars}</div>`
}

export const createStatusCard = ({ name, status, message, uptime, dailyHistory, easterEgg }) => {
  const card = document.createElement('article')
  card.className = 'status-card'
  card.dataset.status = status

  const uptimeText = uptime !== null && uptime !== undefined ? `${uptime.toFixed(1)}%` : ''
  const tooltipHtml = easterEgg ? `<div class="tooltip">${easterEgg}</div>` : ''
  const chartHtml = dailyHistory ? createUptimeChart(dailyHistory) : ''

  card.innerHTML = `
    ${tooltipHtml}
    <div class="status-card__info">
      <span class="status-card__name">${name}</span>
      ${message ? `<span class="status-card__message">${message}</span>` : ''}
      ${chartHtml}
    </div>
    <div class="status-card__right">
      ${uptimeText ? `<span class="status-card__uptime">${uptimeText}</span>` : ''}
      <div class="status-indicator" data-status="${status}"></div>
    </div>
  `

  return card
}

export const createServiceCard = (service, siteConfig) => {
  const easterEgg = siteConfig ? getEasterEgg(siteConfig.easterEggs, service.status) : null

  return createStatusCard({
    name: siteConfig?.name || service.name,
    status: service.status,
    message: service.status === 'down' ? service.incidents?.[0]?.reason : null,
    uptime: service.uptime_30d,
    dailyHistory: service.daily_history,
    easterEgg,
  })
}

export const createCustomCard = (custom, state) => {
  return createStatusCard({
    name: custom.name,
    status: state.status,
    message: state.message,
    uptime: null,
    dailyHistory: null,
    easterEgg: null,
  })
}
