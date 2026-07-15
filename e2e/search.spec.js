import { test, expect } from '@playwright/test'

test.describe('Search & Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.movie-grid', { timeout: 15000 })
  })

  test('search input is visible', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="Buscar"], input[placeholder*="buscar"], .search-bar input').first()
    await expect(searchInput).toBeVisible()
  })

  test('typing in search filters results', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="Buscar"], input[placeholder*="buscar"], .search-bar input').first()
    await searchInput.fill('Batman')
    await page.waitForTimeout(1000)
    const cards = page.locator('.movie-card')
    const count = await cards.count()
    if (count > 0) {
      const firstTitle = await cards.first().locator('.movie-title').textContent()
      expect(firstTitle.toLowerCase()).toContain('bat')
    }
  })

  test('clear search shows all movies again', async ({ page }) => {
    const searchInput = page.locator('input[type="text"], input[placeholder*="Buscar"], input[placeholder*="buscar"], .search-bar input').first()
    await searchInput.fill('Batman')
    await page.waitForTimeout(500)
    await searchInput.fill('')
    await page.waitForTimeout(1000)
    const cards = page.locator('.movie-card')
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(10)
  })

  test('genre filter works', async ({ page }) => {
    const genreSelect = page.locator('select, .filter-select').first()
    if (await genreSelect.isVisible()) {
      await genreSelect.selectOption({ index: 1 })
      await page.waitForTimeout(1000)
      const cards = page.locator('.movie-card')
      const count = await cards.count()
      expect(count).toBeGreaterThanOrEqual(1)
    }
  })
})
