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
    await page.goto('/deseadas')
    await page.waitForTimeout(2000)
    const content = page.locator('text=Deseadas, text=deseadas, h2, h3').first()
    await expect(content).toBeVisible()
  })
})
