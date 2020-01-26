const ytdl = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')

module.exports = {
  youtubeToMp3: (req, res) => {
    if (!req.query.id) res.end('Enter a youtube videoId')

    const id = req.query.id

    req.setTimeout(0)

    // let totKb = 0
    // const stream = ytdl(id, {
    //   quality: 'highestaudio'
    // })
    // .pipe(res)

    const stream = ytdl(id, {
      quality: 'highestaudio'
    }),
    bitrate = 320

    const proc = ffmpeg(stream)
    .audioBitrate(bitrate)
    .toFormat('mp3')
    .on('start', () => {
      console.log('started ', id)
    })
    .on('progress', p => {
      console.log(`${id}: ${(p.targetSize / 1000).toFixed(2)}mb downloaded at ${p.currentKbps}kb/s speed`)
      console.log('________')
    })
    .on('end', () => {
      console.log(`finished downloading ${id}`)
    })
    .on('error', e => {
      console.log('error is: ', e)
      res.end('Cant convert this video')
    })
    .pipe(res)
  }
}
