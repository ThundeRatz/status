import { getRandomTitle, getRandomLastUpdated, getRandomFooter } from '../config/easterEggs.js'
import { formatTimeAgo } from '../services/statusFetcher.js'

let titleClickCount = 0
let secretRevealed = false

const setupSecretTitleClick = (titleElement) => {
  titleElement.style.cursor = 'default'
  titleElement.addEventListener('click', () => {
    titleClickCount++
    if (titleClickCount >= 5 && !secretRevealed) {
      secretRevealed = true
      titleElement.textContent = 'Parabens, voce quebrou mais uma coisa'
      titleElement.style.color = 'var(--status-degraded)'
      setTimeout(() => {
        titleElement.style.color = ''
      }, 3000)
    }
  })
}

export const renderHeader = (container, overallStatus, updatedAt) => {
  const title = getRandomTitle(overallStatus)
  const lastUpdatedTemplate = getRandomLastUpdated()
  const timeAgo = formatTimeAgo(updatedAt)
  const lastUpdated = lastUpdatedTemplate.replace('{time}', timeAgo)

  const statusText = {
    allUp: 'Todos operacionais',
    someDown: 'Alguns com problemas',
    allDown: 'Tudo fora do ar',
  }[overallStatus] || 'Status desconhecido'

  const statusClass = {
    allUp: 'up',
    someDown: 'degraded',
    allDown: 'down',
  }[overallStatus] || 'unknown'

  const header = document.createElement('header')
  header.className = 'header'
  header.innerHTML = `
    <h1 class="header__title">${title}</h1>
    <div class="header__status" data-status="${statusClass}">
      <div class="status-indicator" data-status="${statusClass}"></div>
      <span>${statusText}</span>
    </div>
    <p class="header__updated">${lastUpdated}</p>
  `

  const titleElement = header.querySelector('.header__title')
  setupSecretTitleClick(titleElement)

  container.appendChild(header)
}

export const renderFooter = (container) => {
  const footerText = getRandomFooter()

  const footer = document.createElement('footer')
  footer.className = 'footer'
  footer.innerHTML = `
    <p>${footerText}</p>
  `

  container.appendChild(footer)
}
