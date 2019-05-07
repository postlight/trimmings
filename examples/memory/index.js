const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const connectFlash = require('connect-flash')
const bodyParser = require('body-parser')
const render = require('./src/render')
const database = require('./src/database')

const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'))
app.use(cookieParser('secret'))
app.use(session({ cookie: { maxAge: 60000 } }))
app.use(connectFlash())
app.use(bodyParser.urlencoded({ extended: true }))

// topic list
app.get('/', (req, res) => {
  const topics = database.all('topics')
  res.send(render('topics', { topics }))
})

// start topic
app.get('/topics/:id', (req, res) => {
  const topic = database.get('topics', req.params.id)
  const firstCard = database.filter('cards', (c) => c.topicId === topic.id)[0]
  res.send(render('topic', { title: topic.name, topic, firstCard }))
})

// flashcard
app.get('/cards/:id', (req, res) => {
  const card = database.get('cards', req.params.id)
  const topic = database.get('topics', card.topicId)
  const cards = database.filter('cards', (c) => c.topicId === topic.id)
  const cardIndex = cards.indexOf(card)
  const previousCard = cardIndex === 0 ? null : cards[cardIndex - 1]
  const nextCard = cards[cardIndex + 1]
  res.send(render('card', { title: topic.name, topic, card, previousCard, nextCard }))
})

// end of flashcards/beginning of quiz
app.get('/topics/:id/quiz', (req, res) => {
  const topic = database.get('topics', req.params.id)
  const firstQuestion = database.filter('questions', (q) => q.topicId === topic.id)[0]
  res.send(render('quiz', { title: topic.name, topic, firstQuestion }))
})

// quiz question (right/wrong)
app.get('/questions/:id', (req, res) => {
  const question = database.get('questions', req.params.id)
  const topic = database.get('topics', question.topicId)
  const answers =
    [
      { answer: question.answer1 },
      { answer: question.answer2 },
      { answer: question.answer3 }
    ]

  res.send(render('question', { title: topic.name, topic, answered: false, question, answers }))
})

app.post('/questions/:id', (req, res) => {
  const question = database.get('questions', req.params.id)
  const topic = database.get('topics', question.topicId)
  const { answer } = req.body

  const answers =
      [
        { answer: question.answer1, checked: answer === question.answer1 },
        { answer: question.answer2, checked: answer === question.answer2 },
        { answer: question.answer3, checked: answer === question.answer3 }
      ]

  const correct = req.body.answer === question.answer1
  const questions = database.filter('questions', (q) => q.topicId === topic.id)
  const questionIndex = questions.indexOf(question)
  const nextQuestion = questions[questionIndex + 1]
  res.send(render('question', { title: topic.name, question, topic, answered: true, correct, answers, nextQuestion }))
})

// quiz complete
app.get('/topics/:id/complete', (req, res) => {
  const topic = database.get('topics', req.params.id)
  res.send(render('complete', { title: topic.name, topic }))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
