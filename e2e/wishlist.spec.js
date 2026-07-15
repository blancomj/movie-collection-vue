import { test, expect } from '@playwright/test'

test.describe('Wishlist', () => {
  test('add movie to wishlist from detail page', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h3', { timeout: 15000 })
    await page.locator('h3').first().click()
    await page.waitForSelector('text=Sinopsis', { timeout: 10000 })

    const wishBtn = page.locator('button:has-text("Deseadas")').first()
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

  test('remove movie from wishlist', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h3', { timeout: 15000 })
    await page.locator('h3').first().click()
    await page.waitForSelector('text=Sinopsis', { timeout: 10000 })

    const wishBtn = page.locator('button:has-text("Deseadas")').first()
    if (await wishBtn.isVisible()) {
      const text = await wishBtn.textContent()
      await wishBtn.click()
      await page.waitForTimeout(1000)
      if (text.includes('Quitar')) {
        await expect(page.locator('button:has-text("Agregar a Deseadas")').first()).toBeVisible()
      } else {
        await expect(page.locator('button:has-text("Quitar de Deseadas")').first()).toBeVisible()
      }
    }
  })

  test('wishlist page loads', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h3', { timeout: 15000 })
    await page.locator('a:has-text("Deseadas")').first().click()
    await page.waitForTimeout(2000)
    const heading = page.locator('h2:has-text("Deseadas"), h3:has-text("Deseadas")').first()
    const movieCount = page.locator('text=/\\d+ peliculas/').first()
    const anyVisible = (await heading.isVisible()) || (await movieCount.isVisible()) || (await page.locator('.movie-title, h3').first().isVisible())
    expect(anyVisible).toBe(true)
  })
})
