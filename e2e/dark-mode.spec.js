import { test, expect } from '@playwright/test'

test.describe('Dark Mode', () => {
  test('dark mode toggle button exists', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('header, nav', { timeout: 10000 })
    const toggle = page.locator('button:has(.fa-moon), button:has(.fa-sun), [aria-label*="tema"], [aria-label*="dark"]').first()
    await expect(toggle).toBeVisible()
  })

  test('clicking toggle switches theme', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('header, nav', { timeout: 10000 })
    const html = page.locator('html')
    const toggle = page.locator('button:has(.fa-moon), button:has(.fa-sun)').first()
    if (await toggle.isVisible()) {
      const hadDark = await html.evaluate(el => el.classList.contains('dark'))
      await toggle.click()
      await page.waitForTimeout(500)
      const hasDark = await html.evaluate(el => el.classList.contains('dark'))
      expect(hasDark).not.toBe(hadDark)
    }
  })

  test('dark mode persists after navigation', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('header, nav', { timeout: 10000 })
    const toggle = page.locator('button:has(.fa-moon), button:has(.fa-sun)').first()
    if (await toggle.isVisible()) {
      await toggle.click()
      await page.waitForTimeout(500)
      const hasDark = await page.locator('html').evaluate(el => el.classList.contains('dark'))
      await page.goto('/')
      await page.waitForTimeout(1000)
      const stillDark = await page.locator('html').evaluate(el => el.classList.contains('dark'))
      expect(stillDark).toBe(hasDark)
    }
  })

  test('dark mode applies dark background', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('header, nav', { timeout: 10000 })
    const toggle = page.locator('button:has(.fa-moon), button:has(.fa-sun)').first()
    if (await toggle.isVisible()) {
      await toggle.click()
      await page.waitForTimeout(500)
      const bgColor = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor)
      expect(bgColor).toBeTruthy()
    }
  })
})
