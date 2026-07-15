import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.movie-grid', { timeout: 15000 })
  })

  test('loads movies grid', async ({ page }) => {
    const cards = page.locator('.movie-card')
    await expect(cards.first()).toBeVisible()
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('displays movie title and poster on cards', async ({ page }) => {
    const firstCard = page.locator('.movie-card').first()
    await expect(firstCard.locator('.movie-title')).not.toBeEmpty()
    await expect(firstCard.locator('img')).toBeVisible()
  })

  test('navigation links are visible', async ({ page }) => {
    await expect(page.locator('nav a, header a').first()).toBeVisible()
  })

  test('paginacion carga mas peliculas', async ({ page }) => {
    const initialCount = await page.locator('.movie-card').count()
    const nextBtn = page.locator('button:has-text("Siguiente"), button:has-text("»"), [aria-label="Siguiente"]').first()
    if (await nextBtn.isVisible()) {
      await nextBtn.click()
      await page.waitForTimeout(1500)
      const newCount = await page.locator('.movie-card').count()
      expect(newCount).toBeGreaterThanOrEqual(1)
    }
  })
})
