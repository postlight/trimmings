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

const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'))
app.use(cookieParser('secret'))
app.use(session({cookie: { maxAge: 60000 }}))
app.use(connectFlash())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  const photos =
    database
      .all('photos')
      .map(p => ({
        ...p,
        height500: Math.round(parseInt(p.ratio, 10) / 100 * 500)
      }))
  res.send(render('root', { title: 'Welcome!', photos }))
})

app.get('/photos/:id', (req, res) => {
  const photo = database.get('photos', req.params.id)
  const user = database.get('users', photo.userId)
  const comments =
    database.all('comments').filter(c => c.photoId === photo.id)

  const userPhotos = database.all('photos').filter(p => p.userId === user.id)
  const photoIndex = userPhotos.indexOf(photo)
  const nextPhoto = userPhotos[photoIndex + 1]
  const previousPhoto = photoIndex > 0 ? userPhotos[photoIndex - 1] : null

  res.send(render(
    'photo',
    {
      title: `${user.name || user.id}: ${photo.caption}`,
      photo: {
        ...photo,
        user,
        comments,
        height500: Math.round(parseInt(photo.ratio, 10) / 100 * 500)
      },
      nextPhoto,
      previousPhoto,
      flash: getFlash(req)
    }
  ))
})

app.get('/:userId', (req, res) => {
  const user = database.get('users', req.params.userId)
  user.photos = database.all('photos').filter(p => p.userId === user.id)

  res.send(render('user', { title: `${user.name} (@${user.id})`, user }))
})

app.post('/photos/:id/likes', (req, res) => {
  const photo = database.get('photos', req.params.id)
  photo.likes++
  req.flash('success', 'Liked!')
  res.redirect(`/photos/${photo.id}`)
})

app.post('/photos/:id/comments', (req, res) => {
  // Hard-coded current user
  const user = database.get('users', 'busy.rando')
  const photo = database.get('photos', req.params.id)
  const text = req.body.text

  if (!text || !text.length) {
    req.flash('error', 'A comment requires text!')
    res.redirect(`/photos/${photo.id}`)
    return
  }

  photo.commentsCount++
  const id = (new Date()).valueOf() + '.' + Math.random()
  database.insert('comments', { id, photoId: photo.id, userId: user.id, text })

  req.flash('success', 'Commented!')
  res.redirect(`/photos/${photo.id}`)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
