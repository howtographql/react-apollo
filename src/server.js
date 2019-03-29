const express = require('express')
const app = express()
const path = require('path')

app.use(express.static('./build'))
app.use(express.static('./public'))
app.get('/ping', (req, res) => {
  res.end('pong')
})
app.use((_, res) => {
  res.sendFile(path.resolve(process.cwd(), './public/index.html'))
})
app.listen(3000, () => {
  console.log("app is listening on 3000")
})

