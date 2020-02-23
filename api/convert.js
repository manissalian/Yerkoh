const ytdl = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const { Readable } = require('stream')

module.exports = {
  youtubeToMp3: (req, res) => {
    if (!req.query.id) res.end('Enter a youtube videoId')

    const id = req.query.id
    const BIT_RATE = 320

    req.setTimeout(0)

    const stream = ytdl(id, {
      quality: 'highestaudio'
    })

    const progressStream = new Readable({
      read() {}
    })

    ytdl.getInfo(id)
    .then(info => {
      return +info.player_response.videoDetails.lengthSeconds
    })
    .then(duration => {
      const ffmpegProcess =
        ffmpeg(stream)
        .audioBitrate(BIT_RATE)
        .toFormat('mp3')
        .on('start', () => {
          console.log('started ', id)

        })
        .on('progress', p => {
          const timeMark = p.timemark
          const timeUnitArray = timeMark.split(':')
          const progressSeconds = Math.floor(
            (+timeUnitArray[0]) * 60 * 60 +
            (+timeUnitArray[1]) * 60 +
            (+timeUnitArray[2])
          )

          const progress = (progressSeconds / duration * 100).toFixed(2) + '%'
          console.log(progress)
          console.log('______')

          progressStream.push(JSON.stringify({
            progress
          }))
        })
        .on('error', e => {
          console.log(e.message)
          res.status(500).end(e.message)
        })
        .on('end', () => {
          console.log('success: ' + id)
          const successResponse = {
            success: true
          }

          progressStream.push(JSON.stringify(successResponse))
          res.end()
        })

      const method = req.params.method

      if (method === 'save') {
        const target = path.join(__dirname, `../youtube_files/${id}.mp3`)

        ffmpegProcess
        .on('end', () => {
          const resMsg = `finished downloading ${id}`
          console.log(resMsg)
          res.end(resMsg)
        })
        .save(target)
      } else if (method === 'stream') {
        ffmpegProcess.pipe(res, {
          end: false
        })

        progressStream.pipe(res, {
          end: false
        })
      } else {
        res.end('Error determining method. Valid methods are: save, stream')
      }
    })
  }
}
