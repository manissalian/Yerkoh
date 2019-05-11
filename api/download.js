const path = require('path')

module.exports = {
  mp3: (req, res) => {
  	if (!req.query.id) res.send('Enter a youtube videoId')

    const file = path.join(__dirname, `../youtube_files/${req.query.id}.mp3`)
  	res.download(file)
  }
}
