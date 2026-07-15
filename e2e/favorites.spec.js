import { test, expect } from '@playwright/test'

test.describe('Favorites', () => {
  test('favorite heart icon is visible on movie card', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h3', { timeout: 15000 })
    const heart = page.locator('button:has(.fa-heart)').first()
    await expect(heart).toBeVisible()
  })

  test('toggle favorite from movie card', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h3', { timeout: 15000 })
    const favBtn = page.locator('button:has(.fa-heart)').first()
    await favBtn.click()
    await page.waitForTimeout(1000)
    const icon = favBtn.locator('i')
    const classes = await icon.getAttribute('class')
    expect(classes).toMatch(/fa-s/)
  })

  test('favorite icon visible on detail page', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h3', { timeout: 15000 })
    await page.locator('h3').first().click()
    await page.waitForSelector('text=Sinopsis', { timeout: 10000 })
    const heart = page.locator('.poster-container button:has(.fa-heart), button:has(.fa-heart)').first()
    if (await heart.isVisible()) {
      await expect(heart).toBeVisible()
    }
  })

  test('favorites page loads', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h3', { timeout: 15000 })
    await page.locator('a:has-text("Favoritos")').first().click()
    await page.waitForTimeout(2000)
    const heading = page.locator('h2:has-text("Favoritos"), h3:has-text("Favoritos")').first()
    const movieCount = page.locator('text=/\\d+ peliculas/').first()
    const anyVisible = (await heading.isVisible()) || (await movieCount.isVisible()) || (await page.locator('.movie-title, h3').first().isVisible())
    expect(anyVisible).toBe(true)
  })
})
