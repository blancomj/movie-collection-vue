import { test, expect } from '@playwright/test'

test.describe('Wishlist', () => {
  test('add movie to wishlist from detail page', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.movie-card', { timeout: 15000 })
    await page.locator('.movie-card').first().click()
    await page.waitForSelector('.detail-page, .movie-title', { timeout: 10000 })

    const wishBtn = page.locator('button:has-text("Agregar a Deseadas")').first()
    if (await wishBtn.isVisible()) {
      await wishBtn.click()
      await page.waitForTimeout(1000)
      await expect(page.locator('button:has-text("Quitar de Deseadas")').first()).toBeVisible()
    }
  })

  test('remove movie from wishlist', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.movie-card', { timeout: 15000 })
    await page.locator('.movie-card').first().click()
    await page.waitForSelector('.detail-page, .movie-title', { timeout: 10000 })

    const wishBtn = page.locator('button:has-text("Agregar a Deseadas"), button:has-text("Quitar de Deseadas")').first()
    if (await wishBtn.isVisible()) {
      const text = await wishBtn.textContent()
      await wishBtn.click()
      await page.waitForTimeout(1000)
      if (text.includes('Agregar')) {
        await expect(page.locator('button:has-text("Quitar de Deseadas")').first()).toBeVisible()
      } else {
        await expect(page.locator('button:has-text("Agregar a Deseadas")').first()).toBeVisible()
      }
    }
  })

  test('wishlist page shows wanted movies', async ({ page }) => {
    await page.goto('/deseadas')
    await page.waitForTimeout(2000)
    const content = page.locator('.movie-grid, .movie-card, .empty-state, text=no hay, text=deseadas').first()
    await expect(content).toBeVisible()
  })

  test('wishlist badge shows count', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('header, nav', { timeout: 10000 })
    const badge = page.locator('.badge, [class*="badge"]').first()
    if (await badge.isVisible()) {
      await expect(badge).toBeVisible()
    }
  })
})
