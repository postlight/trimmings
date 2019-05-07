test('inline', async () => {
  const page = await browser.newPage()
  await page.goto('http://localhost:4444/inline-1.html')
  await expect(page).toClick('a')
  await expect(page).not.toMatch('This is page 2')
  await expect(page).toMatch('Is this what you were expecting?')
})
