describe('current', () => {
  test('standard link', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/current.html')

    await expect(page).toMatchElement('.here.redact-current.redact-current--fragment')
    await expect(page).not.toMatchElement('.there.redact-current')
    await expect(page).toMatchElement('.fragment.redact-current')
    await expect(page).not.toMatchElement('.fragment.redact-current--fragment')
    await expect(page).toMatchElement('.fragment2.redact-current')
    await expect(page).not.toMatchElement('.fragment2.redact-current--fragment')
    await expect(page).not.toMatchElement('.query.redact-current')
  })

  test('link with fragment', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/current.html#foobar')

    await expect(page).toMatchElement('.here.redact-current')
    await expect(page).not.toMatchElement('.here.redact-current--fragment')
    await expect(page).not.toMatchElement('.there.redact-current')
    await expect(page).toMatchElement('.fragment.redact-current.redact-current--fragment')
    await expect(page).toMatchElement('.fragment2.redact-current')
    await expect(page).not.toMatchElement('.fragment2.redact-current--fragment')
    await expect(page).not.toMatchElement('.query.redact-current')
  })

  test('link with empty fragment', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/current.html#')

    await expect(page).toMatchElement('.here.redact-current.redact-current--fragment')
    await expect(page).not.toMatchElement('.there.redact-current')
    await expect(page).toMatchElement('.fragment.redact-current')
    await expect(page).not.toMatchElement('.fragment.redact-current--fragment')
    await expect(page).toMatchElement('.fragment2.redact-current')
    await expect(page).not.toMatchElement('.fragment2.redact-current--fragment')
    await expect(page).not.toMatchElement('.query.redact-current')
  })

  test('link with non-matching fragment', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/current.html#nobody')

    await expect(page).not.toMatchElement('.redact-current--fragment')
    await expect(page).toMatchElement('.here.redact-current')
    await expect(page).not.toMatchElement('.there.redact-current')
    await expect(page).toMatchElement('.fragment.redact-current')
    await expect(page).toMatchElement('.fragment2.redact-current')
    await expect(page).not.toMatchElement('.query.redact-current')
  })

  test('link with query', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/current.html?foo=bar')

    await expect(page).not.toMatchElement('.here.redact-current')
    await expect(page).not.toMatchElement('.there.redact-current')
    await expect(page).not.toMatchElement('.fragment.redact-current')
    await expect(page).not.toMatchElement('.fragment2.redact-current')
    await expect(page).toMatchElement('.query.redact-current.redact-current--fragment')
  })

  test('fragment updates', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/current.html#foobar')
    await expect(page).toClick('.fragment2')

    await expect(page).toMatchElement('.here.redact-current')
    await expect(page).not.toMatchElement('.here.redact-current--fragment')
    await expect(page).not.toMatchElement('.there.redact-current')
    await expect(page).toMatchElement('.fragment.redact-current')
    await expect(page).not.toMatchElement('.fragment.redact-current.redact-current--fragment')
    await expect(page).toMatchElement('.fragment2.redact-current.redact-current--fragment')
    await expect(page).not.toMatchElement('.query.redact-current')
  })
})
