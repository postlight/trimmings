const express = require('express')
const render = require('./src/render')
const database = require('./src/database')

const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  const photos = database.all('photos')
  res.send(render('root', { title: 'Welcome!', photos }))
})

app.get('/photos/:id', (req, res) => {
  const photo = database.get('photos', req.params.id)
  photo.comments =
    database.all('comments').filter(c => c.photoId === photo.id)

  res.send(render('photo', { title: `@${photo.userId}: ${photo.caption}`, photo }))
})

app.get('/:userId', (req, res) => {
  const user = database.get('users', req.params.userId)
  user.photos = database.all('photos').filter(p => p.userId === user.id)

  res.send(render('user', { title: `${user.name} (@${user.id})`, user }))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
