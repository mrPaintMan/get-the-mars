const express = require('express')
const app = express()
const port = 3000
const path = require('path');

app.use(express.static('.'))
app.use(express.static('../content'))

app.get('/', (req, res) => {
    console.log(__dirname + '/index.html');
    res.sendFile(path.join(__dirname + '/../index.html'));
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})