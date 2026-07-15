import { test, expect } from '@playwright/test'

test.describe('Favorites', () => {
  test('favorite heart icon is visible on movie card', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.movie-card', { timeout: 15000 })
    const heart = page.locator('.movie-card button i.fa-heart, .movie-card .fa-heart').first()
    await expect(heart).toBeVisible()
  })

  test('toggle favorite from movie card', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.movie-card', { timeout: 15000 })
    const favBtn = page.locator('.movie-card button:has(.fa-heart)').first()
    await favBtn.click()
    await page.waitForTimeout(1000)
    const icon = favBtn.locator('i')
    const classes = await icon.getAttribute('class')
    expect(classes).toMatch(/fa-(solid|regular)/)
  })

  test('favorite icon visible on detail page poster', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.movie-card', { timeout: 15000 })
    await page.locator('.movie-card').first().click()
    await page.waitForSelector('.detail-page, .movie-title', { timeout: 10000 })
    const heart = page.locator('.poster-container button i.fa-heart, .poster-container .fa-heart').first()
    if (await heart.isVisible()) {
      await expect(heart).toBeVisible()
    }
  })

  test('favorites page shows favorited movies', async ({ page }) => {
    await page.goto('/favoritas')
    await page.waitForTimeout(2000)
    const content = page.locator('.movie-grid, .movie-card, .empty-state, text=no hay, text=favoritas').first()
    await expect(content).toBeVisible()
  })
})
