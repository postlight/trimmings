describe('inline', () => {
  test('standard link', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/inline-1.html')
    await expect(page).toClick('a.first')
    await expect(page).not.toMatch('This is page 2')
    await expect(page).toMatch('Is this what you were expecting?')
    expect(await page.title()).toContain('Page 1')
  })

  test('standard link with updated title', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/inline-1.html')
    await expect(page).toClick('a.update-title')
    await expect(page).not.toMatch('This is page 2')
    await expect(page).toMatch('Is this what you were expecting?')
    expect(await page.title()).toContain('Page 2')
  })

  test('fallback link: false target', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/inline-1.html')
    await expect(page).toClick('a.false-target')
    await page.waitForNavigation({ timeout: 100 })
    await expect(page.url()).toContain('/inline-2.html')
  })

  test('fallback link: false include', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/inline-1.html')
    await expect(page).toClick('a.false-include')
    await page.waitForNavigation({ timeout: 100 })
    await expect(page.url()).toContain('/inline-2.html')
  })

  test('fallback link: bad template', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/inline-1.html')
    await expect(page).toClick('a.false-template')
    await page.waitForNavigation({ timeout: 100 })
    await expect(page.url()).toContain('/inline-2.html')
  })

  test('standard form', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/inline-1.html')
    await expect(page).toClick('button.good')
    await expect(page).not.toMatch('This is page 2')
    await expect(page).toMatch('Is this what you were expecting?')
  })

  test('form fallback: false include', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/inline-1.html')
    await expect(page).toClick('button.bad')
    await page.waitForNavigation({ timeout: 100 })
    await expect(page.url()).toContain('/inline-2.html?foo=bar')
  })

  test('template', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/inline-template.html')
    await expect(page).toClick('a')
    await expect(page).toMatchElement('.inline-target .template-body .include')
  })

  test('update location', async () => {
    const page = await browser.newPage()
    await page.goto('http://localhost:4444/inline-location.html')

    // First, click our link
    await expect(page).toClick('a')
    await expect(page).toMatch('This is a starting page')
    await expect(page).toMatch('Is this what you were expecting?')
    expect(await page.title()).toMatch('Page 2')
    await expect(page.url()).toContain('/inline-2.html')

    // Now go back and make sure things are how they were
    await page.goBack()
    await expect(page).toMatch('This is a starting page')
    await expect(page).toMatch('Load page 2 with an updated location')
    await expect(page).not.toMatch('Is this what you were expecting?')
    expect(await page.title()).toMatch('Inline (Location)')
    await expect(page.url()).toContain('/inline-location.html')

    // Now go forward and make sure that all of that works too
    await page.goForward()
    await expect(page).toMatch('This is a starting page')
    await expect(page).toMatch('Is this what you were expecting?')
    expect(await page.title()).toMatch('Page 2')
    await expect(page.url()).toContain('/inline-2.html')

    // Finally, go back again and click the link *again* to make sure it's still
    // properly bound
    await page.goBack()
    await expect(page).toClick('a')
    await expect(page).toMatch('This is a starting page')
    await expect(page).toMatch('Is this what you were expecting?')
    expect(await page.title()).toMatch('Page 2')
    await expect(page.url()).toContain('/inline-2.html')

  })

  describe('methods', () => {
    test('prepend', async () => {
      const page = await browser.newPage()
      await page.goto('http://localhost:4444/inline-method.html')
      await expect(page).toClick('a.prepend')
      await expect(page).toMatchElement('.include + .child-1 + .child-2 + .child-3')
    })

    test('append', async () => {
      const page = await browser.newPage()
      await page.goto('http://localhost:4444/inline-method.html')
      await expect(page).toClick('a.append')
      await expect(page).toMatchElement('.child-1 + .child-2 + .child-3 + .include')
    })

    test('reduce-prepend', async () => {
      const page = await browser.newPage()
      await page.goto('http://localhost:4444/inline-method.html')
      await expect(page).toClick('a.reduce-prepend')
      await expect(page).toMatchElement('.include:first-child + .child-2:last-child')
    })

    test('reduce-append', async () => {
      const page = await browser.newPage()
      await page.goto('http://localhost:4444/inline-method.html')
      await expect(page).toClick('a.reduce-append')
      await expect(page).toMatchElement('.child-2:first-child + .include:last-child')
    })
  })
})
