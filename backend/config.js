const config = {
  environment: process.env.NODE_ENV || 'dev',
  server: {
    port: process.env.PORT || 8080
  },
  mongo: {
    url: process.env.MONGO_DB_URI || 'mongodb://localhost/itec2018-quiz-platform'
  },
  session: {
    secret: 'eK8NM8LPnh9w42lLiCNN'
  },
  origin: {
    url: 'https://quizzard.club'
  }
}

module.exports = config
