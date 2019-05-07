const foobar = require('./foobar')

test('remove', async (done) => {
  const { page, serverAddress } = foobar
  await page.goto(`${serverAddress}/remove.html`)

  const jokesBefore = await page.evaluate(() => document.querySelector('.haha'))

  expect(jokesBefore === null).toBe(false)

  await page.click('.no-jokes')

  const jokesAfter = await page.evaluate(() => document.querySelector('.haha'))

  expect(jokesAfter === null).toBe(true)

  done()
})
