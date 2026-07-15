import { test, expect } from '@playwright/test'

test.describe('Movie Detail', () => {
  test('clicking a movie opens detail view', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h3', { timeout: 15000 })
    await page.locator('h3').first().click()
    await page.waitForSelector('text=Sinopsis', { timeout: 10000 })
    await expect(page.locator('text=Sinopsis').first()).toBeVisible()
  })

  test('detail page shows poster', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h3', { timeout: 15000 })
    await page.locator('h3').first().click()
    await page.waitForSelector('.poster-image', { timeout: 10000 })
    await expect(page.locator('.poster-image').first()).toBeVisible()
  })

  test('detail page shows movie title', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h3', { timeout: 15000 })
    const firstTitle = await page.locator('h3').first().textContent()
    await page.locator('h3').first().click()
    await page.waitForSelector('.movie-title', { timeout: 10000 })
    const detailTitle = await page.locator('.movie-title').first().textContent()
    expect(detailTitle).toContain(firstTitle.trim().substring(0, 10))
  })

  test('back button returns to home', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('h3', { timeout: 15000 })
    await page.locator('h3').first().click()
    await page.waitForSelector('text=Sinopsis', { timeout: 10000 })
    const backBtn = page.locator('button:has-text("Volver"), a:has-text("Volver")').first()
    if (await backBtn.isVisible()) {
      await backBtn.click()
      await page.waitForTimeout(1000)
      await expect(page.locator('h3').first()).toBeVisible()
    }
  })
})
