const { test, expect } = require('@playwright/test');

test('artly review checks', async ({ page }) => {
  await page.setViewportSize({ width: 1536, height: 960 });
  await page.goto('http://localhost:9292/pages/artly-ai', { waitUntil: 'domcontentloaded' });

  const bookBtn = page.getByRole('button', { name: 'Book a Demo' });
  await expect(bookBtn).toBeVisible();
  await bookBtn.click();
  const modal = page.locator('#ArtlyAiHeroDemoModal-template--27203712778518__artly_ai_hero');
  await expect(modal).toHaveAttribute('aria-hidden', 'false');
  await expect(modal).not.toBeHidden();
  await page.keyboard.press('Escape');

  const connectBtn = page.getByRole('button', { name: 'Connect With an Expert' });
  await expect(connectBtn).toBeVisible();
  await connectBtn.click();
  const modalAfterConnect = page.locator('#ArtlyAiHeroDemoModal-template--27203712778518__artly_ai_hero');
  await expect(modalAfterConnect).toHaveAttribute('aria-hidden', 'false');
  await expect(modalAfterConnect).not.toBeHidden();
  await page.keyboard.press('Escape');

  const trustedSection = page.locator('[data-section-type="trusted-by-logo-strip"]');
  await expect(trustedSection).toHaveCount(1);
  const trustedRect = await trustedSection.first().evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { width: r.width, left: r.left, right: r.right };
  });

  console.log(JSON.stringify({
    bookModalOpen: await modal.isVisible(),
    connectModalOpen: await modalAfterConnect.isVisible(),
    trustedSectionWidth: trustedRect.width,
    trustedSectionLeft: trustedRect.left
  }));
});
