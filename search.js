const { google } = require('googleapis'),
      { key } = require('./config'),
      service = google.youtube('v3')

module.exports = {
  youtube: (req, res) => {
    if (!req.query.q) res.send('Enter a query')

    const params = {
      maxResults: '10',
      part: 'snippet',
      q: req.query.q,
      type: 'video',
      key
    }
    
    service.search.list(params, (err, resp) => {
      if (err || !resp || !resp.data || !resp.data.items) res.send('Youtube search failed for:', req.query.q)

      const items = resp.data.items.map(item => {
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnailUrl: item.snippet.thumbnails.medium.url
        }
      })

      let ids = ''
      for (var i in items) {
        ids += items[i].id
        if (i < items.length - 1) ids += ','
      }

      service.videos.list({
        part: 'contentDetails',
        id: ids,
        key
      }, (err, resp) => {
        if (err || !resp || !resp.data || !resp.data.items) res.send('Youtube info failed for:', req.query.q)

        for (var i in resp.data.items) {
          items[i].duration = ytDurationToSeconds(resp.data.items[i].contentDetails.duration)
        }

        const data = { items }

        res.send(data)
      })
    })
  }
}

function ytDurationToSeconds(duration) {
  let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)

  match = match.slice(1).map(x => {
    if (x == null) return

    return x.replace(/\D/, '')
  })

  const hours = (parseInt(match[0]) || 0),
        minutes = (parseInt(match[1]) || 0),
        seconds = (parseInt(match[2]) || 0)

  return hours * 3600 + minutes * 60 + seconds
}
