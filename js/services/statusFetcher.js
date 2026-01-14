const REPO = 'ThundeRatz/status'
const BRANCH = 'data'
const REMOTE_URL = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/status.json`
const LOCAL_URL = './data/status.json'

const isLocal = () => {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
}

export const fetchStatus = async () => {
  const url = isLocal() ? LOCAL_URL : REMOTE_URL
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch status: ${response.status}`)
  }

  return response.json()
}

export const getOverallStatus = (services) => {
  if (!services || services.length === 0) {
    return 'unknown'
  }

  const allUp = services.every((s) => s.status === 'up')
  const allDown = services.every((s) => s.status === 'down')

  if (allUp) return 'allUp'
  if (allDown) return 'allDown'
  return 'someDown'
}

export const formatTimeAgo = (isoString) => {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'agora'
  if (diffMins < 60) return `${diffMins}min`
  if (diffHours < 24) return `${diffHours}h`
  return `${diffDays}d`
}
