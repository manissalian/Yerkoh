const fs = require('fs')
const readline = require('readline')

function makeDir(dir) {
  if (fs.existsSync(dir)) return

  fs.mkdirSync(dir)
}

function makeFile(file) {
  if (fs.existsSync(file)) return

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question('Enter your youtube API key: ', key => {
    rl.close()

    fs.writeFile(file, `YOUTUBE_API_KEY=${key}`, err => {
      console.log(err ? err : 'successfully created .env file')
    })
  })
}

makeDir('youtube_files')

makeFile('.env')
