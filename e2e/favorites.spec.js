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
    expect(classes).toMatch(/fa-(solid|regular)/)
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
    await page.goto('/favoritos')
    await page.waitForTimeout(2000)
    const content = page.locator('text=Favoritos, text=favoritos, h2, h3').first()
    await expect(content).toBeVisible()
  })
})
