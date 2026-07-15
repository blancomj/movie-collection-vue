import { test, expect } from '@playwright/test'

test.describe('Search & Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('text=peliculas', { timeout: 15000 })
  })

  test('search input is visible', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="uscar"]').first()
    await expect(searchInput).toBeVisible()
  })

  test('typing in search filters results', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="uscar"]').first()
    await searchInput.fill('Batman')
    await page.waitForTimeout(1500)
    const headings = page.locator('h3')
    const count = await headings.count()
    if (count > 0) {
      const firstTitle = await headings.first().textContent()
      expect(firstTitle.toLowerCase()).toContain('bat')
    }
  })

  test('clear search shows all movies again', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="uscar"]').first()
    await searchInput.fill('Batman')
    await page.waitForTimeout(500)
    await searchInput.fill('')
    await page.waitForTimeout(1500)
    const headings = page.locator('h3')
    const count = await headings.count()
    expect(count).toBeGreaterThanOrEqual(10)
  })

  test('genre filter works', async ({ page }) => {
    const genreSelect = page.locator('select').first()
    if (await genreSelect.isVisible()) {
      await genreSelect.selectOption({ index: 1 })
      await page.waitForTimeout(1500)
      const headings = page.locator('h3')
      const count = await headings.count()
      expect(count).toBeGreaterThanOrEqual(1)
    }
  })
})
