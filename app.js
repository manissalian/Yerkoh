const fs = require('fs')
const express = require('express')
const app = express()
const port = 3000

const search = require('./search.js')
const convert = require('./convert.js')
const download = require('./download.js')

app.listen(port, () => {
  console.log(`Listening on port ${port}`)

  const dir = 'youtube_files'

  if (fs.existsSync(dir)) return

  fs.mkdirSync(dir)
})

app.get('/search/youtube', search.youtube)
app.get('/convert/youtubeToMp3', convert.youtubeToMp3)
app.get('/download/mp3', download.mp3)
