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

const formatBody = (body) =>
  `<p>${
    body
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\r\n/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br />')
  }</p>`

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

app.get('/messages/new', (req, res) => {
  const { replyTo, forwardOf } = req.query || {}

  const message = {
    subject: '',
    body: '',
    to: '',
    toAddress: '',
    from: 'You Fakedemo',
    fromAddress: 'you@fake.email'
  }

  let lastLocation = '/'

  if (replyTo || forwardOf) {
    const ref = database.get('messages', replyTo || forwardOf)
    lastLocation = `/messages/${ref.id}`
    message.subject = `${replyTo ? 'Re:' : 'Fwd'} ${ref.subject}`
    message.body = `${ref.from} wrote:\n\n${ref.body.split(/\\n/g).map(l => `> ${l}`).join('\n')}`

    if (replyTo) {
      message.body = `\n\n${message.body}`
      message.to = ref.from
      message.toAddress = ref.fromAddress
    }
  }

  res.send(render(
    'composer',
    {
      title: 'New Message',
      message,
      lastLocation,
      unreadCount: getUnreadCount()
    }
  ))
})

app.get('/messages/:id', (req, res) => {
  const message = database.get('messages', req.params.id)
  const folder = database.get('folders', message.folderId)

  if (req.query.edited !== 'true') {
    message.read = '1'
  }

  res.send(render(
    'message',
    {
      title: message.subject,
      message: {
        ...message,
        read: message.read === '1',
        body: formatBody(message.body),
        archived: folder.id === 'archive',
        sent: folder.id === 'sent'
      },
      folder,
      unreadCount: getUnreadCount(),
      flash: getFlash(req)
    }
  ))
})

app.post('/messages', (req, res) => {
  const { subject, body, to, toAddress } = req.body || {}

  const message = {
    type: 'messages',
    id: (new Date()).valueOf() + '.' + Math.random().toString().replace(/^0./, ''),
    read: '1',
    folderId: 'sent',
    subject,
    body,
    to,
    toAddress,
    from: 'You Fakedemo',
    fromAddress: 'you@fake.email'
  }

  console.log({ body })

  database.insert('messages', message)

  let destination = req.body.destination

  if (!destination.match(/^\/messages\/[^/]+\/?$/)) {
    destination = '/'
  }

  res.redirect(destination)
})

app.post('/messages/:id', (req, res) => {
  const message = database.get('messages', req.params.id)
  const params = req.body
  const newMessage =
    {
      type: message.type,
      id: message.id,
      read: params.read || message.read,
      folderId: params.folderId || message.folderId
    }

  Object.assign(message, newMessage)
  res.redirect(`/messages/${message.id}?edited=true`)
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

  messages = messages.reverse()

  res.send(render(
    'folder',
    {
      title: folder.title,
      query,
      folder,
      messages: messages.map((m) => ({ ...m, excerpt: m.body.replace(/<\/?[^>]+>/g, ''), read: m.read === '1' })),
      unreadCount: getUnreadCount(),
      flash: getFlash(req)
    }
  ))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
