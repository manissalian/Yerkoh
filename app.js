const express = require('express')
const app = express()
//const port = 3000

const search = require('./api/search.js')
const convert = require('./api/convert.js')
const download = require('./api/download.js')

let port = process.env.PORT
if (port == null || port == "") {
  port = 3000
}
app.listen(port)

// app.listen(port, () => {
//   console.log(`Listening on port ${port}`)
// })

app.get('/search/youtube', search.youtube)
app.get('/convert/youtubeToMp3', convert.youtubeToMp3)
app.get('/download/mp3', download.mp3)
