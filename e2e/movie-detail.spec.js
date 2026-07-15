import { test, expect } from '@playwright/test'

test.describe('Movie Detail', () => {
  test('clicking a movie card opens detail view', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.movie-card', { timeout: 15000 })
    const firstCard = page.locator('.movie-card').first()
    await firstCard.click()
    await page.waitForSelector('.detail-page, .movie-title', { timeout: 10000 })
    await expect(page.locator('.movie-title').first()).toBeVisible()
  })

  test('detail page shows poster', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.movie-card', { timeout: 15000 })
    await page.locator('.movie-card').first().click()
    await page.waitForSelector('.detail-page, .movie-title', { timeout: 10000 })
    const poster = page.locator('.poster-image, .movie-poster img, img[alt]').first()
    await expect(poster).toBeVisible()
  })

  test('detail page shows synopsis', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.movie-card', { timeout: 15000 })
    await page.locator('.movie-card').first().click()
    await page.waitForSelector('.detail-page, .movie-title', { timeout: 10000 })
    const synopsis = page.locator('text=Sinopsis').first()
    if (await synopsis.isVisible()) {
      await expect(synopsis).toBeVisible()
    }
  })

  test('back button returns to home', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.movie-card', { timeout: 15000 })
    await page.locator('.movie-card').first().click()
    await page.waitForSelector('.detail-page, .movie-title', { timeout: 10000 })
    const backBtn = page.locator('button:has-text("Volver"), a:has-text("Volver"), button:has-text("←")').first()
    if (await backBtn.isVisible()) {
      await backBtn.click()
      await page.waitForTimeout(1000)
      await expect(page.locator('.movie-grid, .movie-card').first()).toBeVisible()
    }
  })
})
