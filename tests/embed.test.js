test('embed', async () => {
  const page = await browser.newPage()
  await page.goto('http://localhost:4444/embed-1.html')
  await expect(page).toMatch('This is page 1.')
  await expect(page).not.toMatch('Visit page 2')
  await expect(page).not.toMatchElement('a')
  await expect(page).toMatch('Is this what you were expecting?')
})
