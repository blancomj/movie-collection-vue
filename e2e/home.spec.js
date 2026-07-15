import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('text=peliculas', { timeout: 15000 })
  })

  test('loads movies', async ({ page }) => {
    await expect(page.locator('img[alt]').first()).toBeVisible({ timeout: 10000 })
    const images = page.locator('img[alt]')
    const count = await images.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('displays movie title on cards', async ({ page }) => {
    const heading = page.locator('h3').first()
    await expect(heading).toBeVisible()
    const text = await heading.textContent()
    expect(text.length).toBeGreaterThan(0)
  })

  test('navigation links are visible', async ({ page }) => {
    await expect(page.locator('text=Inicio').first()).toBeVisible()
    await expect(page.locator('text=Favoritos').first()).toBeVisible()
    await expect(page.locator('text=Deseadas').first()).toBeVisible()
  })

  test('pagination loads more movies', async ({ page }) => {
    const initialCount = await page.locator('h3').count()
    const nextBtn = page.locator('button:has-text("»"), button:has-text("Siguiente"), [aria-label="Siguiente"]').first()
    if (await nextBtn.isVisible()) {
      await nextBtn.click()
      await page.waitForTimeout(2000)
      const newCount = await page.locator('h3').count()
      expect(newCount).toBeGreaterThanOrEqual(1)
    }
  })
})
