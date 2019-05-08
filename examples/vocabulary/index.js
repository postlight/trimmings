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

const renderQuestion = (req, res) => {
  const question = database.get('questions', req.params.id)
  const topic = database.get('topics', question.topicId)
  const { tried = '', answer = '' } = req.body
  const answerIndex = [1, 2, 3].find(n => question[`answer${n}`] === answer)

  const formatAnswer = (index) => {
    const thisAnswer = question[`answer${index}`]
    const checked = answer === thisAnswer
    const selected = checked || tried.indexOf(index) > -1

    return {
      answer: thisAnswer,
      hotkey: `Digit${index}`,
      correct: selected && thisAnswer === question.correctAnswer,
      incorrect: selected && thisAnswer !== question.correctAnswer,
      checked: answer === thisAnswer
    }
  }

  const answers = [formatAnswer('1'), formatAnswer('2'), formatAnswer('3')]
  const correct = answer === question.correctAnswer
  const questions = database.filter('questions', (q) => q.topicId === topic.id)
  const questionIndex = questions.indexOf(question)
  const nextQuestion = questions[questionIndex + 1]

  res.send(render(
    'question',
    {
      title: topic.name,
      question,
      topic,
      correct,
      answers,
      nextQuestion,
      tried: `${tried}${answerIndex || ''}`
    }
  ))
}

app.get('/questions/:id', (req, res) => renderQuestion(req, res))

app.post('/questions/:id', (req, res) => renderQuestion(req, res))

// quiz complete
app.get('/topics/:id/complete', (req, res) => {
  const topic = database.get('topics', req.params.id)
  res.send(render('complete', { title: topic.name, topic }))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
