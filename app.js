const express = require('express')
const app = express()
const port = process.env.PORT != null && process.env.PORT != '' ? process.env.PORT : 3000

const search = require('./api/search.js')
const convert = require('./api/convert.js')
const download = require('./api/download.js')

const extendTimeoutMiddleware = require('./middleware/herokuExtendTimeout.js')

app.use(extendTimeoutMiddleware)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

app.get('/search/youtube', search.youtube)
app.get('/convert/youtubeToMp3/:method', convert.youtubeToMp3)
app.get('/download/mp3', download.mp3)
