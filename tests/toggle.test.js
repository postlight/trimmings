test('toggle', async () => {
  const page = await browser.newPage()
  await page.goto('http://localhost:4444/toggle.html')
  await expect(page).toMatchElement('.haha')
  await expect(page).not.toMatchElement('.haha--toggled')
  await expect(page).toClick('.no-jokes')
  await expect(page).toMatchElement('.haha--toggled')
})
