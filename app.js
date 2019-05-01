const express = require('express')
const app = express()
const port = 3000

const search = require('./search.js')
const convert = require('./convert.js')

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

app.get('/search/youtube', search.youtube)
app.get('/convert/youtubeToMp3', convert.youtubeToMp3)
