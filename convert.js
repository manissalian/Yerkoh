const ytdl = require('ytdl-core'),
      ffmpeg = require('fluent-ffmpeg')

module.exports = {
  youtubeToMp3: (req, res) => {
    if (!req.query.id) res.send('Enter a youtube videoId')

    youtubeToMp3(req.query.id).then(target => {
      res.send(target)
    })
  }
}

function youtubeToMp3 (id) {
  return new Promise((resolve, reject) => {
    const stream = ytdl(id, {
      quality: 'highestaudio'
    }),
    bitrate = 320,
    target = `${__dirname}/${id}.mp3`

    ffmpeg(stream)
    .audioBitrate(bitrate)
    .save(target)
    .on('progress', p => {
      console.log(`${(p.targetSize / 1000).toFixed(2)}mb of ${target} downloaded at ${p.currentKbps}kb/s speed`)
      console.log('________')
    })
    .on('end', () => {
      console.log(`downloading ${target} finished`)
      resolve(target)
    })
  })
}
