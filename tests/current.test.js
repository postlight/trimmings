describe('current', () => {
  test('standard link', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/current.html')

    await expect(page).toMatchElement('.here.trimmings-current.trimmings-current--fragment')
    await expect(page).not.toMatchElement('.there.trimmings-current')
    await expect(page).toMatchElement('.fragment.trimmings-current')
    await expect(page).not.toMatchElement('.fragment.trimmings-current--fragment')
    await expect(page).toMatchElement('.fragment2.trimmings-current')
    await expect(page).not.toMatchElement('.fragment2.trimmings-current--fragment')
    await expect(page).not.toMatchElement('.query.trimmings-current')
  })

  test('link with fragment', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/current.html#foobar')

    await expect(page).toMatchElement('.here.trimmings-current')
    await expect(page).not.toMatchElement('.here.trimmings-current--fragment')
    await expect(page).not.toMatchElement('.there.trimmings-current')
    await expect(page).toMatchElement('.fragment.trimmings-current.trimmings-current--fragment')
    await expect(page).toMatchElement('.fragment2.trimmings-current')
    await expect(page).not.toMatchElement('.fragment2.trimmings-current--fragment')
    await expect(page).not.toMatchElement('.query.trimmings-current')
  })

  test('link with empty fragment', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/current.html#')

    await expect(page).toMatchElement('.here.trimmings-current.trimmings-current--fragment')
    await expect(page).not.toMatchElement('.there.trimmings-current')
    await expect(page).toMatchElement('.fragment.trimmings-current')
    await expect(page).not.toMatchElement('.fragment.trimmings-current--fragment')
    await expect(page).toMatchElement('.fragment2.trimmings-current')
    await expect(page).not.toMatchElement('.fragment2.trimmings-current--fragment')
    await expect(page).not.toMatchElement('.query.trimmings-current')
  })

  test('link with non-matching fragment', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/current.html#nobody')

    await expect(page).not.toMatchElement('.trimmings-current--fragment')
    await expect(page).toMatchElement('.here.trimmings-current')
    await expect(page).not.toMatchElement('.there.trimmings-current')
    await expect(page).toMatchElement('.fragment.trimmings-current')
    await expect(page).toMatchElement('.fragment2.trimmings-current')
    await expect(page).not.toMatchElement('.query.trimmings-current')
  })

  test('link with query', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/current.html?foo=bar')

    await expect(page).not.toMatchElement('.here.trimmings-current')
    await expect(page).not.toMatchElement('.there.trimmings-current')
    await expect(page).not.toMatchElement('.fragment.trimmings-current')
    await expect(page).not.toMatchElement('.fragment2.trimmings-current')
    await expect(page).toMatchElement('.query.trimmings-current.trimmings-current--fragment')
  })

  test('fragment updates', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/current.html#foobar')
    await expect(page).toClick('.fragment2')

    await expect(page).toMatchElement('.here.trimmings-current')
    await expect(page).not.toMatchElement('.here.trimmings-current--fragment')
    await expect(page).not.toMatchElement('.there.trimmings-current')
    await expect(page).toMatchElement('.fragment.trimmings-current')
    await expect(page).not.toMatchElement('.fragment.trimmings-current.trimmings-current--fragment')
    await expect(page).toMatchElement('.fragment2.trimmings-current.trimmings-current--fragment')
    await expect(page).not.toMatchElement('.query.trimmings-current')
  })

  test('post-load updates', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/current2.html')
    await expect(page).toClick('.inline')

    await expect(page).toMatchElement('.here.trimmings-current')
    await expect(page).not.toMatchElement('.inline.trimmings-current')
    await expect(page).not.toMatchElement('.current3-inline-container .current3.trimmings-current')
    await expect(page).toMatchElement('.current3-inline-container .current2.trimmings-current')
    await expect(page).not.toMatchElement('.current3-embed-container .current3.trimmings-current')
    await expect(page).toMatchElement('.current3-embed-container .current2.trimmings-current')
  })
})
