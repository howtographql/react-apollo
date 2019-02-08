const express = require('express')
const app = express()

app.use(express.static('./build'))
app.use(express.static('./public'))
app.listen(3000, () => {
  console.log("app is listening on 3000")
})

