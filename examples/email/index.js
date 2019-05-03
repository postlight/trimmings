const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const connectFlash = require('connect-flash')
const bodyParser = require('body-parser')
const render = require('./src/render')
const database = require('./src/database')

const getFlash = (req) => {
  const errorFlash = req.flash('error')
  const successFlash = req.flash('success')

  if (errorFlash && errorFlash.length) {
    return { type: 'error', message: errorFlash }
  }

  if (successFlash && successFlash.length) {
    return { type: 'success', message: successFlash }
  }
}

const getUnreadCount = () =>
  database.all('messages').filter(m => !parseInt(m.read, 10)).length

const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'))
app.use(cookieParser('secret'))
app.use(session({ cookie: { maxAge: 60000 } }))
app.use(connectFlash())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  const folders = database.all('folders')
  res.send(render('folders', { folders, unreadCount: getUnreadCount() }))
})

app.get('/messages/:id', (req, res) => {
  const message = database.get('messages', req.params.id)
  const folder = database.get('folders', message.folderId)

  res.send(render(
    'message',
    {
      title: message.subject,
      message,
      folder,
      unreadCount: getUnreadCount(),
      flash: getFlash(req)
    }
  ))
})

app.get('/:id', (req, res) => {
  const folder = database.get('folders', req.params.id)
  let messages = database.all('messages').filter(m => m.folderId === folder.id)
  const query = req.query.q || ''

  if (query.length) {
    messages =
      messages
        .filter(m =>
          `${m.from} ${m.subject} ${m.body}`
            .replace(/<\/?[^>]+>/g, '')
            .replace(/\s+/g, ' ')
            .toLowerCase()
            .indexOf(query.toLowerCase()) > -1
        )
  }

  messages.forEach((message) => {
    message.excerpt = message.body.replace(/<\/?[^>]+>/g, '')
  })

  res.send(render(
    'folder',
    {
      title: folder.title,
      query,
      folder,
      messages,
      unreadCount: getUnreadCount(),
      flash: getFlash(req)
    }
  ))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
