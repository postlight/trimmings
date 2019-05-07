test('remove', async () => {
  const page = await browser.newPage()
  await page.goto('http://localhost:4444/remove.html')
  await expect(page).toMatch('Haha')
  await expect(page).toClick('.no-jokes')
  await expect(page).not.toMatch('Haha')
})
