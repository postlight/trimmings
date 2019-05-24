describe('current', () => {
  test('standard link', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/current.html')

    await expect(page).toMatchElement('.here.trim-current.trim-current--fragment')
    await expect(page).not.toMatchElement('.there.trim-current')
    await expect(page).toMatchElement('.fragment.trim-current')
    await expect(page).not.toMatchElement('.fragment.trim-current--fragment')
    await expect(page).toMatchElement('.fragment2.trim-current')
    await expect(page).not.toMatchElement('.fragment2.trim-current--fragment')
    await expect(page).not.toMatchElement('.query.trim-current')
  })

  test('link with fragment', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/current.html#foobar')

    await expect(page).toMatchElement('.here.trim-current')
    await expect(page).not.toMatchElement('.here.trim-current--fragment')
    await expect(page).not.toMatchElement('.there.trim-current')
    await expect(page).toMatchElement('.fragment.trim-current.trim-current--fragment')
    await expect(page).toMatchElement('.fragment2.trim-current')
    await expect(page).not.toMatchElement('.fragment2.trim-current--fragment')
    await expect(page).not.toMatchElement('.query.trim-current')
  })

  test('link with empty fragment', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/current.html#')

    await expect(page).toMatchElement('.here.trim-current.trim-current--fragment')
    await expect(page).not.toMatchElement('.there.trim-current')
    await expect(page).toMatchElement('.fragment.trim-current')
    await expect(page).not.toMatchElement('.fragment.trim-current--fragment')
    await expect(page).toMatchElement('.fragment2.trim-current')
    await expect(page).not.toMatchElement('.fragment2.trim-current--fragment')
    await expect(page).not.toMatchElement('.query.trim-current')
  })

  test('link with non-matching fragment', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/current.html#nobody')

    await expect(page).not.toMatchElement('.trim-current--fragment')
    await expect(page).toMatchElement('.here.trim-current')
    await expect(page).not.toMatchElement('.there.trim-current')
    await expect(page).toMatchElement('.fragment.trim-current')
    await expect(page).toMatchElement('.fragment2.trim-current')
    await expect(page).not.toMatchElement('.query.trim-current')
  })

  test('link with query', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/current.html?foo=bar')

    await expect(page).not.toMatchElement('.here.trim-current')
    await expect(page).not.toMatchElement('.there.trim-current')
    await expect(page).not.toMatchElement('.fragment.trim-current')
    await expect(page).not.toMatchElement('.fragment2.trim-current')
    await expect(page).toMatchElement('.query.trim-current.trim-current--fragment')
  })

  test('fragment updates', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/current.html#foobar')
    await expect(page).toClick('.fragment2')

    await expect(page).toMatchElement('.here.trim-current')
    await expect(page).not.toMatchElement('.here.trim-current--fragment')
    await expect(page).not.toMatchElement('.there.trim-current')
    await expect(page).toMatchElement('.fragment.trim-current')
    await expect(page).not.toMatchElement('.fragment.trim-current.trim-current--fragment')
    await expect(page).toMatchElement('.fragment2.trim-current.trim-current--fragment')
    await expect(page).not.toMatchElement('.query.trim-current')
  })

  test('post-load updates', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/current2.html')
    await expect(page).toClick('.inline')

    await expect(page).toMatchElement('.here.trim-current')
    await expect(page).not.toMatchElement('.inline.trim-current')
    await expect(page).not.toMatchElement('.current3-inline-container .current3.trim-current')
    await expect(page).toMatchElement('.current3-inline-container .current2.trim-current')
    await expect(page).not.toMatchElement('.current3-embed-container .current3.trim-current')
    await expect(page).toMatchElement('.current3-embed-container .current2.trim-current')
  })
})
