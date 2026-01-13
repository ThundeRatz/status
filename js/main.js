import { fetchStatus, getOverallStatus } from './services/statusFetcher.js'
import { pickWeighted } from './services/randomizer.js'
import { sites, findSiteConfig } from './config/sites.js'
import { customs } from './config/customs.js'
import { createServiceCard, createCustomCard } from './components/statusCard.js'
import { renderHeader, renderFooter } from './components/header.js'

const renderServices = (container, services) => {
  const section = document.createElement('section')
  section.className = 'section'
  section.innerHTML = `
    <h2 class="section__title">Services</h2>
    <div class="status-list" id="services-list"></div>
  `

  const list = section.querySelector('#services-list')

  for (const service of services) {
    const siteConfig = findSiteConfig(service.name)
    const card = createServiceCard(service, siteConfig)
    list.appendChild(card)
  }

  container.appendChild(section)
}

const renderCustoms = (container) => {
  const section = document.createElement('section')
  section.className = 'section'
  section.innerHTML = `
    <h2 class="section__title">Team Status</h2>
    <div class="status-list" id="customs-list"></div>
  `

  const list = section.querySelector('#customs-list')

  for (const custom of customs) {
    const state = pickWeighted(custom.states)
    if (state) {
      const card = createCustomCard(custom, state)
      list.appendChild(card)
    }
  }

  container.appendChild(section)
}

const renderError = (container, error) => {
  const errorDiv = document.createElement('div')
  errorDiv.className = 'error'
  errorDiv.style.cssText = `
    text-align: center;
    padding: 48px 20px;
    color: var(--status-down);
  `
  errorDiv.innerHTML = `
    <p>Erro ao carregar status</p>
    <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 8px;">${error.message}</p>
  `
  container.appendChild(errorDiv)
}

const init = async () => {
  const app = document.getElementById('app')
  if (!app) return

  try {
    const data = await fetchStatus()
    const overallStatus = getOverallStatus(data.services)

    renderHeader(app, overallStatus, data.updated_at)

    const main = document.createElement('main')
    main.className = 'container'
    app.appendChild(main)

    renderServices(main, data.services)
    renderCustoms(main)
    renderFooter(app)
  } catch (error) {
    console.error('Failed to load status:', error)
    renderError(app, error)
  }
}

init()
