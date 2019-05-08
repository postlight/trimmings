describe('toggle', () => {
  test('button', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/toggle.html')
    await expect(page).toClick('.no-jokes')
    await expect(page).toMatchElement('.haha.haha--toggled')
  })

  test('text input', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/toggle.html')
    await expect(page).toFill('.text-check', 'Foo')
    await expect(page).toMatchElement('.text-status.text-status--present')
    await page.focus('.text-check')
    await page.keyboard.press('Backspace')
    await page.keyboard.press('Backspace')
    await page.keyboard.press('Backspace')
    await new Promise(resolve => setTimeout(resolve, 1))
    await expect(page).not.toMatchElement('.text-status.text-status--present')
  })

  test('checkbox input', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/toggle.html')
    await expect(page).toClick('.checkbox-check')
    await expect(page).toMatchElement('.checkbox-status.checkbox-status--checked')
    await expect(page).toClick('.checkbox-check')
    await expect(page).not.toMatchElement('.checkbox-status.checkbox-status--checked')
  })

  test('radio input', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/toggle.html')
    await expect(page).toClick('.radio-check--1')
    await expect(page).toMatchElement('.radio-status.radio-status--1')
    await expect(page).toClick('.radio-check--2')
    await expect(page).toMatchElement('.radio-status.radio-status--2')
    await expect(page).not.toMatchElement('.radio-status.radio-status--1')
  })
})
