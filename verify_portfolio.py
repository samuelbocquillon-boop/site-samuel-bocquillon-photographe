import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1440, "height": 1600})
        await page.goto("https://wedding-samuel.preview.emergentagent.com/portfolio", wait_until="networkidle")
        await page.wait_for_timeout(3000)
        grid = await page.query_selector('[data-testid="unified-gallery-grid"]')
        if grid:
            await grid.scroll_into_view_if_needed()
            await page.wait_for_timeout(2000)
            await grid.screenshot(path="/app/portfolio_grid.png")
            print("saved grid")
        else:
            await page.screenshot(path="/app/portfolio_grid.png")
            print("saved full")
        await browser.close()

asyncio.run(main())
