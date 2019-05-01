const DATA = {
  photos: {
    '1': {
      url: '/photos/1.jpg',
      caption: 'At the beach!',
      userId: 'beach.lover',
      credit: 'https://unsplash.com/photos/83zRhEhFMfo',
      photographer: 'Sai Kiran Anagani',
      likes: 1039,
      commentsCount: 1
    },
    '2': {
      url: '/photos/2.jpg',
      caption: 'I freakin’ love the beach. Look at these surfboards.',
      userId: 'beach.lover',
      credit: 'https://unsplash.com/photos/VAggpKuA2zU',
      photographer: 'Abigail Lynn',
      likes: 1158,
      commentsCount: 0
    }
  },
  users: {
    'beach.lover': {
      name: 'Beach Lover 1996'
    }
  },
  comments: {
    '1': {
      photoId: '1',
      userId: 'beach.lover',
      text: 'LOL I’m commenting on my own photo'
    }
  }
}

Object.keys(DATA).forEach((type) => {
  Object.keys(DATA[type]).forEach((id) => {
    DATA[type][id] = { type, id, ...DATA[type][id] }
  })
})

const database = {
  get: (type, id) => {
    return DATA[type][id]
  },

  all: (type) => {
    return Object.values(DATA[type])
  }
}

module.exports = database
