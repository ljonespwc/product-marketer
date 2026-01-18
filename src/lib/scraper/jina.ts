const JINA_BASE_URL = 'https://r.jina.ai'
const MAX_RETRIES = 3
const TIMEOUT_MS = 45000

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export interface ScrapeResult {
  success: boolean
  markdown?: string
  error?: string
}

export async function scrapeUrl(url: string): Promise<ScrapeResult> {
  const jinaUrl = `${JINA_BASE_URL}/${url}`

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

      const response = await fetch(jinaUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const markdown = await response.text()

      if (!markdown || markdown.trim().length < 100) {
        throw new Error('Response too short or empty')
      }

      return {
        success: true,
        markdown,
      }
    } catch (error) {
      const isLastAttempt = attempt === MAX_RETRIES - 1

      if (isLastAttempt) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }

      // Exponential backoff: 1s, 2s, 4s
      const backoffMs = Math.pow(2, attempt) * 1000
      await sleep(backoffMs)
    }
  }

  return {
    success: false,
    error: 'Max retries exceeded',
  }
}
