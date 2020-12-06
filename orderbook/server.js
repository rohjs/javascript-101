const path = require('path')
const fs = require('fs')
const util = require('util')
const express = require('express')
const helmet = require('helmet')

const PORT = 3000

const app = express()

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use('/scripts', express.static(__dirname + '/node_modules'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

const readFileContent = util.promisify(fs.readFile)
async function fetchOrderbookData() {
  const filename = `orderbook.json`
  const filePath = path.join(__dirname, 'public', filename)

  try {
    const data = await readFileContent(filePath, { encoding: 'utf-8' })
    return data
  } catch (error) {
    console.error(error)
  }
}

app.get('/orderbook', async (req, res) => {
  const data = (await fetchOrderbookData()) || {}
  res.send(data)
})

app.listen(PORT, () => {
  console.log(`>>> Server listening ${PORT}`)
})
