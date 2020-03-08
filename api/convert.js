const ytdl = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const EventEmitter = require('events')

const progressEmitters = {}

module.exports = {
  youtubeToMp3: (req, res) => {
    if (!req.query.id) res.end('Enter a youtube videoId')

    const id = req.query.id
    const conversionId = req.query.conversionId
    const BIT_RATE = 320

    req.setTimeout(0)

    const stream = ytdl(id, {
      quality: 'highestaudio'
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

          if (progressEmitters[conversionId]) {
            progressEmitters[conversionId].emit('progress', progress)
          }
        })
        .on('error', e => {
          console.log(e.message)

          if (progressEmitters[conversionId]) {
            delete progressEmitters[conversionId]
          }

          res.status(500).end(e.message)
        })
        .on('end', () => {
          console.log('complete: ' + id)

          if (progressEmitters[conversionId]) {
            progressEmitters[conversionId].emit('complete')
          }

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
      } else {
        res.end('Error determining method. Valid methods are: save, stream')
      }
    })
  },
  getProgress: (req, res) => {
    const conversionId = req.query.conversionId

    progressEmitters[conversionId] = new EventEmitter()

    res.setHeader('X-Content-Type-Options', 'nosniff')

    const progressCallback = progress => {
      res.write(JSON.stringify({
        progress
      }))
    }
    progressEmitters[conversionId].on('progress', progressCallback)

    progressEmitters[conversionId].once('complete', () => {
      console.log(conversionId)

      progressEmitters[conversionId].removeListener('progress', progressCallback)

      delete progressEmitters[conversionId]

      res.end(JSON.stringify({
        success: true
      }))
    })
  }
}
